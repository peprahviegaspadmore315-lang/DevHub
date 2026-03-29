package com.learningplatform.service.ai.impl;

import com.learningplatform.config.AIConfig;
import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.service.MockAIResponseService;
import com.learningplatform.service.ai.AIProvider;
import com.learningplatform.service.ai.AIProviderReply;
import com.learningplatform.service.ai.AIProviderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "openai")
public class OpenAIProvider implements AIProvider {
    private static final String IMAGE_DATA_URL_PREFIX = "data:image/";
    private static final String IMAGE_GENERATION_REQUEST_PATTERN =
        "(?:\\b(?:generate|create|make|draw|design|produce|render|illustrate|paint)\\b.{0,90}\\b(?:image|picture|photo|art|illustration|logo|icon|avatar|poster|wallpaper|banner|portrait|scene|drawing)\\b)|" +
        "(?:\\bshow me\\b.{0,70}\\b(?:image|picture|photo|art|illustration|logo|poster|wallpaper|avatar)\\b)|" +
        "(?:\\b(?:logo|poster|wallpaper|avatar|icon|illustration|concept art|cover art)\\b.{0,40}\\b(?:for|of)\\b)";
    private static final String VISION_REFUSAL_PATTERN =
        "(?:can't|cannot|unable to|do not|don't).{0,120}(?:see|view|inspect|analy[sz]e).{0,60}(?:image|images|photo|picture|screenshot)|" +
        "(?:not equipped with (?:visual|image) perception)|" +
        "(?:my (?:eyes|vision) (?:are|is) purely textual)|" +
        "(?:process(?:es|ing)? (?:the )?words you write)|" +
        "(?:text-based ai)|" +
        "(?:directly inspect images that are attached)";

    private final RestTemplate restTemplate;
    private final AIConfig aiConfig;
    private final MockAIResponseService mockAIResponseService;

    public OpenAIProvider(
        RestTemplate restTemplate,
        AIConfig aiConfig,
        MockAIResponseService mockAIResponseService
    ) {
        this.restTemplate = restTemplate;
        this.aiConfig = aiConfig;
        this.mockAIResponseService = mockAIResponseService;
    }

    @Override
    public AIProviderReply chat(String message, Map<String, Object> context) {
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        if (!isLiveProviderConfigured()) {
            log.info("OpenAI provider is unavailable or disabled, using local DevHub fallback");
            return getFallbackReply(message, context, getStatusMessage());
        }

        if (looksLikeImageGenerationRequest(message, context)) {
            return generateImageReply(message, context);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(aiConfig.getOpenAiApiKey());
            String imageDataUrl = extractImageDataUrl(context);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(
                buildRequestBody(message, context),
                headers
            );

            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                aiConfig.getOpenAiUrl(),
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            String reply = extractResponseText(responseEntity.getBody());
            if (reply == null || reply.isBlank()) {
                throw new IllegalStateException("Empty reply from OpenAI Responses API");
            }

            if (imageDataUrl != null && looksLikeVisionRefusal(reply)) {
                HttpEntity<Map<String, Object>> retryEntity = new HttpEntity<>(
                    buildRequestBody(buildVisionRetryPrompt(message), context),
                    headers
                );

                ResponseEntity<Map> retryResponseEntity = restTemplate.exchange(
                    aiConfig.getOpenAiUrl(),
                    HttpMethod.POST,
                    retryEntity,
                    Map.class
                );

                String retriedReply = extractResponseText(retryResponseEntity.getBody());
                if (retriedReply != null && !retriedReply.isBlank()) {
                    reply = retriedReply;
                }
            }

            return AIProviderReply.builder()
                .content(reply.trim())
                .provider("openai")
                .providerLabel("ChatGPT")
                .source("openai-live")
                .sourceLabel("ChatGPT online")
                .live(true)
                .statusMessage("Answered by ChatGPT online.")
                .build();
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.warn(
                "OpenAI API error: {} - {}. Falling back to local DevHub assistant.",
                ex.getStatusCode(),
                ex.getResponseBodyAsString()
            );
            return getFallbackReply(
                message,
                context,
                buildApiErrorStatusMessage(ex.getStatusCode().value(), ex.getResponseBodyAsString())
            );
        } catch (Exception ex) {
            log.warn(
                "Failed to get OpenAI response, using local DevHub fallback: {}",
                ex.getMessage()
            );
            return getFallbackReply(
                message,
                context,
                "ChatGPT online could not answer just now, so DevHub used the local fallback for this reply."
            );
        }
    }

    @Override
    public String transcribeAudio(
        byte[] audioData,
        String mimeType,
        String fileName,
        Map<String, Object> context
    ) {
        if (audioData == null || audioData.length == 0) {
            throw new IllegalArgumentException("Audio recording cannot be empty.");
        }

        if (!isLiveProviderConfigured()) {
            throw new IllegalStateException("ChatGPT voice transcription is not available until the live AI provider is configured.");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(aiConfig.getOpenAiApiKey());

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("model", aiConfig.getTranscriptionModel());
            body.add("file", buildAudioFilePart(audioData, mimeType, fileName));
            String languageHint = normalizeTranscriptionLanguage(context);
            String promptHint = buildTranscriptionPrompt(context);

            if (languageHint != null) {
                body.add("language", languageHint);
            }

            if (promptHint != null) {
                body.add("prompt", promptHint);
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                aiConfig.getOpenAiTranscriptionUrl(),
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            String transcript = extractTranscriptionText(responseEntity.getBody());
            if (transcript == null || transcript.isBlank()) {
                throw new IllegalStateException("ChatGPT returned an empty transcript.");
            }

            return transcript.trim();
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.warn(
                "OpenAI transcription API error: {} - {}.",
                ex.getStatusCode(),
                ex.getResponseBodyAsString()
            );
            throw new IllegalStateException(
                buildTranscriptionStatusMessage(ex.getStatusCode().value(), ex.getResponseBodyAsString())
            );
        } catch (IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            log.warn("Failed to transcribe audio with OpenAI: {}", ex.getMessage());
            throw new IllegalStateException(
                "ChatGPT could not transcribe the voice recording right now. Please try again."
            );
        }
    }

    @Override
    public AIProviderStatus getStatus() {
        boolean configured = isLiveProviderConfigured();
        return AIProviderStatus.builder()
            .enabled(aiConfig.isEnabled())
            .configured(configured)
            .live(configured)
            .provider("openai")
            .providerLabel("ChatGPT")
            .source(configured ? "openai-live" : "local-fallback")
            .sourceLabel(configured ? "ChatGPT online" : "ChatGPT setup needed")
            .message(getStatusMessage())
            .build();
    }

    private Map<String, Object> buildRequestBody(String message, Map<String, Object> context) {
        return isChatCompletionsEndpoint()
            ? buildChatCompletionsRequestBody(message, context)
            : buildResponsesRequestBody(message, context);
    }

    private Map<String, Object> buildResponsesRequestBody(String message, Map<String, Object> context) {
        String model = aiConfig.getModel();
        List<Map<String, Object>> content = new ArrayList<>();
        content.add(Map.of(
            "type", "input_text",
            "text", message.trim()
        ));

        String imageDataUrl = extractImageDataUrl(context);
        if (imageDataUrl != null) {
            Map<String, Object> imageContent = new LinkedHashMap<>();
            imageContent.put("type", "input_image");
            imageContent.put("image_url", imageDataUrl);
            imageContent.put("detail", "auto");
            content.add(imageContent);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("instructions", buildInstructions(context));
        body.put("input", List.of(
            Map.of(
                "role", "user",
                "content", content
            )
        ));
        body.put("max_output_tokens", aiConfig.getMaxTokens());
        if (model != null && model.startsWith("gpt-5")) {
            body.put("reasoning", Map.of("effort", "none"));
        }
        return body;
    }

    private Map<String, Object> buildChatCompletionsRequestBody(String message, Map<String, Object> context) {
        String imageDataUrl = extractImageDataUrl(context);
        Object userContent = message.trim();

        if (imageDataUrl != null) {
            List<Map<String, Object>> content = new ArrayList<>();
            content.add(Map.of(
                "type", "text",
                "text", message.trim()
            ));
            content.add(Map.of(
                "type", "image_url",
                "image_url", Map.of(
                    "url", imageDataUrl,
                    "detail", "auto"
                )
            ));
            userContent = content;
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", aiConfig.getModel());
        body.put("messages", List.of(
            Map.of(
                "role", "system",
                "content", buildInstructions(context)
            ),
            Map.of(
                "role", "user",
                "content", userContent
            )
        ));
        body.put("max_tokens", aiConfig.getMaxTokens());
        body.put("temperature", aiConfig.getTemperature());
        return body;
    }

    private String buildInstructions(Map<String, Object> context) {
        StringBuilder instructions = new StringBuilder(
            aiConfig.getSystemPrompt() != null && aiConfig.getSystemPrompt().getContent() != null
                ? aiConfig.getSystemPrompt().getContent().trim()
                : "You are DevHub AI, a helpful assistant."
        );

        if (context == null || context.isEmpty()) {
            return instructions.toString();
        }

        instructions.append("\n\nUse this context when it is relevant to the user's question:\n");
        appendContextLine(instructions, "Course title", context.get("courseTitle"));
        appendContextLine(instructions, "Topic title", context.get("topicTitle"));
        appendContextLine(instructions, "Lesson title", context.get("lessonTitle"));
        appendContextLine(instructions, "Language", context.get("language"));
        appendContextLine(instructions, "Requested tool", context.get("tool"));
        appendContextLine(instructions, "Current route", context.get("route"));
        appendContextLine(instructions, "Attachment name", context.get("attachmentName"));

        if (extractImageDataUrl(context) != null) {
            instructions.append("A screenshot image is attached. Analyze the visible content directly and answer from what is actually shown.\n");
            instructions.append("Do not say that you cannot see, inspect, or analyze the image when the attachment is present.\n");
        }

        appendContextBlock(instructions, "Topic summary", context.get("topicSummary"), 1400);
        appendContextBlock(instructions, "Lesson content", context.get("lessonContent"), 2200);
        appendContextBlock(instructions, "Code example", context.get("codeExample"), 1400);
        appendContextBlock(instructions, "Selected code", context.get("selectedCode"), 1400);
        appendContextBlock(instructions, "Recent conversation", context.get("recentConversation"), 1200);

        Object recentExercises = context.get("recentExercises");
        if (recentExercises != null) {
            instructions.append("Recent exercises: ")
                .append(recentExercises.toString())
                .append("\n");
        }

        instructions.append(
            "If the user's question is broad or unrelated to the lesson, answer it normally and only reference the lesson when it genuinely helps."
        );

        return instructions.toString();
    }

    private void appendContextLine(StringBuilder builder, String label, Object value) {
        if (value == null) {
            return;
        }

        String normalized = value.toString().trim();
        if (!normalized.isEmpty()) {
            builder.append(label).append(": ").append(normalized).append("\n");
        }
    }

    private void appendContextBlock(StringBuilder builder, String label, Object value, int maxLength) {
        if (value == null) {
            return;
        }

        String normalized = value.toString().replaceAll("\\s+", " ").trim();
        if (normalized.isEmpty()) {
            return;
        }

        if (normalized.length() > maxLength) {
            normalized = normalized.substring(0, maxLength);
        }

        builder.append(label).append(": ").append(normalized).append("\n");
    }

    private String extractResponseText(Map<String, Object> responseBody) {
        return isChatCompletionsEndpoint()
            ? extractChatCompletionsText(responseBody)
            : extractResponsesText(responseBody);
    }

    private String extractResponsesText(Map<String, Object> responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return null;
        }

        Object outputText = responseBody.get("output_text");
        if (outputText instanceof String text && !text.isBlank()) {
            return text;
        }

        Object output = responseBody.get("output");
        if (!(output instanceof List<?> outputItems)) {
            return null;
        }

        StringBuilder combinedText = new StringBuilder();

        for (Object outputItem : outputItems) {
            if (!(outputItem instanceof Map<?, ?> itemMap)) {
                continue;
            }

            Object content = itemMap.get("content");
            if (!(content instanceof List<?> contentItems)) {
                continue;
            }

            for (Object contentItem : contentItems) {
                if (!(contentItem instanceof Map<?, ?> contentMap)) {
                    continue;
                }

                Object type = contentMap.get("type");
                Object text = contentMap.get("text");
                if ("output_text".equals(type) && text instanceof String textValue && !textValue.isBlank()) {
                    if (combinedText.length() > 0) {
                        combinedText.append("\n\n");
                    }
                    combinedText.append(textValue.trim());
                }
            }
        }

        return combinedText.length() > 0 ? combinedText.toString() : null;
    }

    private String extractChatCompletionsText(Map<String, Object> responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return null;
        }

        Object choices = responseBody.get("choices");
        if (!(choices instanceof List<?> choiceItems) || choiceItems.isEmpty()) {
            return null;
        }

        Object firstChoice = choiceItems.get(0);
        if (!(firstChoice instanceof Map<?, ?> choiceMap)) {
            return null;
        }

        Object message = choiceMap.get("message");
        if (!(message instanceof Map<?, ?> messageMap)) {
            return null;
        }

        Object content = messageMap.get("content");
        if (content instanceof String text && !text.isBlank()) {
            return text;
        }

        if (!(content instanceof List<?> contentItems)) {
            return null;
        }

        StringBuilder combinedText = new StringBuilder();
        for (Object contentItem : contentItems) {
            if (!(contentItem instanceof Map<?, ?> contentMap)) {
                continue;
            }

            Object type = contentMap.get("type");
            Object text = contentMap.get("text");
            if ("text".equals(type) && text instanceof String textValue && !textValue.isBlank()) {
                if (combinedText.length() > 0) {
                    combinedText.append("\n\n");
                }
                combinedText.append(textValue.trim());
            }
        }

        return combinedText.length() > 0 ? combinedText.toString() : null;
    }

    private HttpEntity<ByteArrayResource> buildAudioFilePart(
        byte[] audioData,
        String mimeType,
        String fileName
    ) {
        HttpHeaders fileHeaders = new HttpHeaders();
        if (mimeType != null && !mimeType.isBlank()) {
            fileHeaders.setContentType(MediaType.parseMediaType(mimeType));
        }

        ByteArrayResource resource = new ByteArrayResource(audioData) {
            @Override
            public String getFilename() {
                return fileName != null && !fileName.isBlank() ? fileName : "voice-input.webm";
            }
        };

        return new HttpEntity<>(resource, fileHeaders);
    }

    private String extractTranscriptionText(Map<String, Object> responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return null;
        }

        Object text = responseBody.get("text");
        if (text instanceof String value && !value.isBlank()) {
            return value;
        }

        Object transcript = responseBody.get("transcript");
        if (transcript instanceof String value && !value.isBlank()) {
            return value;
        }

        return null;
    }

    private String buildVisionRetryPrompt(String message) {
        String trimmedMessage = message == null ? "" : message.trim();
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("An image is attached.\n");
        promptBuilder.append("Inspect the image directly before answering.\n");
        promptBuilder.append(
            "Describe the main subject, supporting objects, colors, any visible text, and the overall layout or composition.\n"
        );
        if (!trimmedMessage.isEmpty()) {
            promptBuilder.append("User request: ").append(trimmedMessage).append("\n");
        }
        promptBuilder.append(
            "If the user asks for code, provide the code after the visual description and ground it in what is visible.\n"
        );
        promptBuilder.append("Do not say that you cannot see, inspect, or analyze the image.");
        return promptBuilder.toString();
    }

    private AIProviderReply generateImageReply(String message, Map<String, Object> context) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiConfig.getOpenAiApiKey());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", aiConfig.getImageModel());
        body.put("prompt", buildImageGenerationPrompt(message, context));
        body.put("size", "1024x1024");

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
            aiConfig.getOpenAiImageUrl(),
            HttpMethod.POST,
            new HttpEntity<>(body, headers),
            Map.class
        );

        String generatedImageUrl = extractGeneratedImageUrl(responseEntity.getBody());
        if (generatedImageUrl == null || generatedImageUrl.isBlank()) {
            throw new IllegalStateException("OpenAI image generation returned no image.");
        }

        return AIProviderReply.builder()
            .content("I generated this image for you from your request.")
            .generatedImageUrl(generatedImageUrl)
            .provider("openai")
            .providerLabel("ChatGPT")
            .source("openai-image")
            .sourceLabel("ChatGPT image studio")
            .live(true)
            .statusMessage("Image generated by ChatGPT online.")
            .build();
    }

    private boolean looksLikeImageGenerationRequest(String message, Map<String, Object> context) {
        if (message == null || message.isBlank() || extractImageDataUrl(context) != null) {
            return false;
        }

        String normalized = message.trim().toLowerCase(Locale.ROOT);
        if (normalized.matches(".*\\b(?:html|css|javascript|react|component|img tag|svg code|base64|markdown)\\b.*")) {
            return false;
        }

        return normalized.matches("(?s).*" + IMAGE_GENERATION_REQUEST_PATTERN + ".*");
    }

    private String buildImageGenerationPrompt(String message, Map<String, Object> context) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append(
            "Generate a single polished image that matches the user's request. Make it visually strong, coherent, and ready to display in a learning app."
        );
        appendContextHint(promptBuilder, "Topic", context == null ? null : context.get("topicTitle"));
        appendContextHint(promptBuilder, "Lesson", context == null ? null : context.get("lessonTitle"));
        appendContextHint(promptBuilder, "Language", context == null ? null : context.get("language"));
        promptBuilder.append(" User request: ").append(message == null ? "" : message.trim());
        return promptBuilder.toString();
    }

    private String extractGeneratedImageUrl(Map<String, Object> responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return null;
        }

        Object data = responseBody.get("data");
        if (!(data instanceof List<?> dataList) || dataList.isEmpty()) {
            return null;
        }

        Object firstItem = dataList.get(0);
        if (!(firstItem instanceof Map<?, ?> imageEntry)) {
            return null;
        }

        Object base64Image = imageEntry.get("b64_json");
        if (base64Image instanceof String encodedImage && !encodedImage.isBlank()) {
            return "data:image/png;base64," + encodedImage;
        }

        Object remoteUrl = imageEntry.get("url");
        if (remoteUrl instanceof String imageUrl && !imageUrl.isBlank()) {
            return imageUrl;
        }

        return null;
    }

    private String buildTranscriptionPrompt(Map<String, Object> context) {
        if (context == null || context.isEmpty()) {
          return "The speaker may use programming and learning terms. Prefer accurate technical transcription and return only the spoken words.";
        }

        StringBuilder promptBuilder = new StringBuilder(
            "The speaker may use programming and learning terms. Prefer accurate technical transcription and return only the spoken words."
        );
        appendContextHint(promptBuilder, "Course", context.get("courseTitle"));
        appendContextHint(promptBuilder, "Topic", context.get("topicTitle"));
        appendContextHint(promptBuilder, "Lesson", context.get("lessonTitle"));
        appendContextHint(promptBuilder, "Language", context.get("language"));
        return promptBuilder.toString();
    }

    private String normalizeTranscriptionLanguage(Map<String, Object> context) {
        if (context == null) {
            return null;
        }

        Object localeValue = context.get("locale");
        if (!(localeValue instanceof String locale) || locale.isBlank()) {
            return null;
        }

        String normalized = locale.trim().toLowerCase(Locale.ROOT);
        int separatorIndex = normalized.indexOf('-');
        if (separatorIndex > 0) {
            normalized = normalized.substring(0, separatorIndex);
        }

        separatorIndex = normalized.indexOf('_');
        if (separatorIndex > 0) {
            normalized = normalized.substring(0, separatorIndex);
        }

        return normalized.isBlank() ? null : normalized;
    }

    private void appendContextHint(StringBuilder builder, String label, Object value) {
        if (value == null) {
            return;
        }

        String normalized = value.toString().replaceAll("\\s+", " ").trim();
        if (normalized.isEmpty()) {
            return;
        }

        builder.append(' ').append(label).append(": ").append(normalized).append('.');
    }

    private boolean looksLikeVisionRefusal(String reply) {
        return reply != null && reply.toLowerCase().matches("(?s).*" + VISION_REFUSAL_PATTERN + ".*");
    }

    private boolean isLiveProviderConfigured() {
        String apiKey = aiConfig.getOpenAiApiKey();
        String apiUrl = aiConfig.getOpenAiUrl();

        return aiConfig.isEnabled() &&
            apiKey != null &&
            !apiKey.isBlank() &&
            !looksLikePlaceholder(apiKey) &&
            apiUrl != null &&
            !apiUrl.isBlank();
    }

    private AIProviderReply getFallbackReply(String message, Map<String, Object> context, String statusMessage) {
        AIChatRequest request = AIChatRequest.builder()
            .message(message)
            .context(buildFallbackContextSummary(context))
            .build();

        AIChatResponse response = mockAIResponseService.generateResponse(request);
        String content;
        if (looksLikeImageGenerationRequest(message, context)) {
            content = "Live image generation is unavailable right now, so I could not create the image yet. Once the live AI provider is available, I can generate the image directly in this chat.";
        } else {
            content = response.getMessage() != null && !response.getMessage().isBlank()
                ? response.getMessage()
                : "I can still help locally with programming, lesson support, writing help, study strategy, brainstorming, and many general questions. For very current facts, the live AI provider is still the better path.";
        }

        return AIProviderReply.builder()
            .content(content)
            .provider("openai")
            .providerLabel("ChatGPT")
            .source("local-fallback")
            .sourceLabel("Local DevHub fallback")
            .live(false)
            .statusMessage(statusMessage)
            .build();
    }

    private boolean isChatCompletionsEndpoint() {
        String apiUrl = aiConfig.getOpenAiUrl();
        return apiUrl != null && apiUrl.toLowerCase().contains("/chat/completions");
    }

    private boolean looksLikePlaceholder(String value) {
        String normalized = value.trim().toLowerCase();
        return normalized.startsWith("dummy") ||
            normalized.contains("your_") ||
            normalized.contains("_here") ||
            normalized.contains("replace_me");
    }

    private String buildApiErrorStatusMessage(int statusCode, String responseBody) {
        String normalized = responseBody == null ? "" : responseBody.toLowerCase();

        if (statusCode == 429 && normalized.contains("insufficient_quota")) {
            return "ChatGPT is configured, but your OpenAI account has no available API quota or billing credit right now. Add billing or use a funded key, then try again.";
        }

        if (statusCode == 401 || normalized.contains("invalid_api_key")) {
            return "ChatGPT rejected the API key. Check the OPENAI_API_KEY value and try again.";
        }

        if (statusCode == 403) {
            return "ChatGPT access is blocked for this request. Check your OpenAI project permissions, organization access, or model availability.";
        }

        if (statusCode == 404) {
            return "ChatGPT could not find the configured endpoint or model. Check AI_OPENAI_URL and AI_MODEL in backend/.env.";
        }

        return "ChatGPT online returned an API error, so DevHub used the local fallback for this reply.";
    }

    private String buildTranscriptionStatusMessage(int statusCode, String responseBody) {
        String normalized = responseBody == null ? "" : responseBody.toLowerCase();

        if (statusCode == 429 && normalized.contains("insufficient_quota")) {
            return "ChatGPT is configured, but the OpenAI account has no API quota or billing credit for voice transcription right now.";
        }

        if (statusCode == 401 || normalized.contains("invalid_api_key")) {
            return "ChatGPT rejected the API key for voice transcription. Check the OpenAI key in backend/.env.";
        }

        if (statusCode == 403) {
            return "ChatGPT blocked the voice transcription request. Check the OpenAI project permissions and model access.";
        }

        if (statusCode == 404) {
            return "ChatGPT could not find the configured voice transcription endpoint or model. Check AI_OPENAI_TRANSCRIPTION_URL and AI_TRANSCRIPTION_MODEL.";
        }

        return "ChatGPT could not transcribe the voice recording right now. Please try again.";
    }

    private String getStatusMessage() {
        String apiKey = aiConfig.getOpenAiApiKey();
        String apiUrl = aiConfig.getOpenAiUrl();

        if (!aiConfig.isEnabled()) {
            return "AI chat is disabled in backend configuration.";
        }

        if (apiKey == null || apiKey.isBlank()) {
            return "Launch the app and enter your OPENAI_API_KEY when prompted, or add it in backend/.env to turn on ChatGPT online.";
        }

        if (looksLikePlaceholder(apiKey)) {
            return "Launch the app and enter your real OpenAI API key when prompted, or replace the placeholder in backend/.env, then restart.";
        }

        if (apiUrl == null || apiUrl.isBlank()) {
            return "Set AI_OPENAI_URL in backend/.env or remove the override so ChatGPT online can connect.";
        }

        if (isChatCompletionsEndpoint()) {
            return "ChatGPT online is configured through the Chat Completions endpoint.";
        }

        return "ChatGPT online is connected through the Responses API.";
    }

    private String buildFallbackContextSummary(Map<String, Object> context) {
        if (context == null || context.isEmpty()) {
            return "";
        }

        StringBuilder summary = new StringBuilder();
        appendFallbackContext(summary, "Course", context.get("courseTitle"));
        appendFallbackContext(summary, "Topic", context.get("topicTitle"));
        appendFallbackContext(summary, "Lesson", context.get("lessonTitle"));
        appendFallbackContext(summary, "Language", context.get("language"));
        appendFallbackContext(summary, "Tool", context.get("tool"));
        appendFallbackContext(summary, "Image attachment", context.get("attachmentName"));
        appendFallbackContext(summary, "Topic summary", context.get("topicSummary"));
        appendFallbackContext(summary, "Lesson content", context.get("lessonContent"));
        appendFallbackContext(summary, "Code example", context.get("codeExample"));
        appendFallbackContext(summary, "Recent conversation", context.get("recentConversation"));
        return summary.toString().trim();
    }

    private String extractImageDataUrl(Map<String, Object> context) {
        if (context == null) {
            return null;
        }

        Object rawValue = context.get("imageDataUrl");
        if (!(rawValue instanceof String imageDataUrl)) {
            return null;
        }

        String normalized = imageDataUrl.trim();
        if (!normalized.startsWith(IMAGE_DATA_URL_PREFIX) || !normalized.contains(",")) {
            return null;
        }

        return normalized;
    }

    private void appendFallbackContext(StringBuilder builder, String label, Object value) {
        if (value == null) {
            return;
        }

        String normalized = value.toString().replaceAll("\\s+", " ").trim();
        if (normalized.isEmpty()) {
            return;
        }

        if (normalized.length() > 600) {
            normalized = normalized.substring(0, 600);
        }

        if (builder.length() > 0) {
            builder.append("\n");
        }

        builder.append(label).append(": ").append(normalized);
    }
}




