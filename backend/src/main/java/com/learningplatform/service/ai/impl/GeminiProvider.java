package com.learningplatform.service.ai.impl;

import com.learningplatform.model.dto.AIChatRequest;
import com.learningplatform.model.dto.AIChatResponse;
import com.learningplatform.service.MockAIResponseService;
import com.learningplatform.service.ai.AIProvider;
import com.learningplatform.service.ai.AIProviderReply;
import com.learningplatform.service.ai.AIProviderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
@ConditionalOnProperty(name = "app.ai.provider", havingValue = "gemini", matchIfMissing = true)
public class GeminiProvider implements AIProvider {
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

    private static final String SYSTEM_PROMPT =
        "You are DevHub AI, a warm and capable AI learning assistant.\n\n" +

        "1. GENERAL BEHAVIOR:\n" +
        "   - Answer general questions clearly, naturally, and directly\n" +
        "   - Be especially strong at programming, web development, debugging, and computer science topics\n" +
        "   - Use a supportive, practical, and easy-to-understand tone\n" +
        "   - Start simple and go deeper only when it helps\n\n" +

        "2. CONTEXT HANDLING:\n" +
        "   - If lesson, topic, course, or code context is provided, use it when it genuinely helps\n" +
        "   - Do not force unrelated answers back into the lesson context\n" +
        "   - When context is relevant, connect the answer back to what the user is learning\n\n" +

        "3. FOR PROGRAMMING QUESTIONS:\n" +
        "   - Explain concepts clearly and accurately\n" +
        "   - Use code examples when they genuinely improve the answer\n" +
        "   - Highlight common mistakes, debugging ideas, or next steps when useful\n\n" +

        "4. FOR GENERAL QUESTIONS:\n" +
        "   - Answer directly before expanding\n" +
        "   - Offer a simple framework, comparison, or short action plan when useful\n" +
        "   - Help with writing, study strategy, brainstorming, and career questions when asked\n\n" +

        "5. FOR VERY CURRENT FACTS:\n" +
        "   - Be honest that live or up-to-date information is better for news, weather, live scores, prices, or recent events\n" +
        "   - Still help with background context, timeless explanations, or planning where possible\n\n" +

        "6. FOR ATTACHED IMAGES:\n" +
        "   - When an image or screenshot is attached, inspect the visible content directly\n" +
        "   - Answer from what is actually shown in the image\n" +
        "   - Never claim that you cannot see images when an attachment is present\n\n" +

        "Current context about what the user is learning may be provided. Use it to improve answers without making the response feel forced.";

    @Value("${app.ai.gemini.api-key:}")
    private String apiKey;

    @Value("${app.ai.gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    @Value("${app.ai.gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${app.ai.gemini.image-model:gemini-2.5-flash-image-preview}")
    private String imageModel;

    @Value("${app.ai.enabled:true}")
    private boolean aiEnabled;

    @Value("${app.ai.gemini.enabled:true}")
    private boolean geminiEnabled;

    private final RestTemplate restTemplate;
    private final MockAIResponseService mockAIResponseService;

    public GeminiProvider(
        RestTemplate restTemplate,
        MockAIResponseService mockAIResponseService
    ) {
        this.restTemplate = restTemplate;
        this.mockAIResponseService = mockAIResponseService;
    }

    @Override
    public AIProviderReply chat(String message, Map<String, Object> context) {
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        if (!isLiveProviderConfigured()) {
            log.info("Live DevHub AI provider is unavailable or disabled, using local fallback");
            return getFallbackReply(message, context, getStatusMessage());
        }

        if (looksLikeImageGenerationRequest(message, context)) {
            return generateImageReply(message, context);
        }

        try {
            // Build the prompt with system instructions, context, and user message
            String prompt = buildPrompt(message, context);
            String imageDataUrl = extractImageDataUrl(context);

            // Prepare request body for the live AI API
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);

            if (imageDataUrl != null) {
                Map<String, Object> imagePart = new HashMap<>();
                Map<String, Object> inlineData = new HashMap<>();
                inlineData.put("mime_type", extractImageMimeType(imageDataUrl));
                inlineData.put("data", extractImageBase64Data(imageDataUrl));
                imagePart.put("inline_data", inlineData);
                parts.add(imagePart);
            }

            content.put("role", "user");
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                baseUrl + "/" + model + ":generateContent?key=" + apiKey,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            // Extract response
            Map<String, Object> responseBody = responseEntity.getBody();
            if (responseBody == null) {
                throw new IllegalStateException("Empty response from DevHub AI provider");
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = 
                (List<Map<String, Object>>) responseBody.get("candidates");
            
            if (candidates == null || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates in DevHub AI provider response");
            }

            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentMap = 
                (Map<String, Object>) firstCandidate.get("content");
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> partsList = 
                (List<Map<String, Object>>) contentMap.get("parts");
            
            if (partsList == null || partsList.isEmpty()) {
                throw new IllegalStateException("No parts in DevHub AI provider response");
            }

            Map<String, Object> firstPart = partsList.get(0);
            String reply = (String) firstPart.get("text");

            if (reply == null || reply.isEmpty()) {
                throw new IllegalStateException("Empty reply from DevHub AI provider");
            }

            if (imageDataUrl != null && looksLikeVisionRefusal(reply)) {
                String retryPrompt = buildVisionRetryPrompt(message, context);
                Map<String, Object> retryRequestBody = new HashMap<>();
                List<Map<String, Object>> retryContents = new ArrayList<>();
                Map<String, Object> retryContent = new HashMap<>();
                List<Map<String, Object>> retryParts = new ArrayList<>();
                retryParts.add(Map.of("text", retryPrompt));

                Map<String, Object> retryImagePart = new HashMap<>();
                Map<String, Object> retryInlineData = new HashMap<>();
                retryInlineData.put("mime_type", extractImageMimeType(imageDataUrl));
                retryInlineData.put("data", extractImageBase64Data(imageDataUrl));
                retryImagePart.put("inline_data", retryInlineData);
                retryParts.add(retryImagePart);

                retryContent.put("role", "user");
                retryContent.put("parts", retryParts);
                retryContents.add(retryContent);
                retryRequestBody.put("contents", retryContents);

                ResponseEntity<Map> retryResponseEntity = restTemplate.exchange(
                    baseUrl + "/" + model + ":generateContent?key=" + apiKey,
                    HttpMethod.POST,
                    new HttpEntity<>(retryRequestBody, headers),
                    Map.class
                );

                String retriedReply = extractReplyText(retryResponseEntity.getBody());
                if (retriedReply != null && !retriedReply.isBlank()) {
                    reply = retriedReply;
                }
            }

            return AIProviderReply.builder()
                .content(reply.trim())
                .provider("gemini")
                .providerLabel("DevHub AI")
                .source("gemini-live")
                .sourceLabel("DevHub AI online")
                .live(true)
                .statusMessage("Answered by DevHub AI online.")
                .build();

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.warn(
                "DevHub AI provider error: {} - {}. Falling back to local assistant.",
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
                "Failed to get DevHub AI response, using local assistant fallback: {}",
                ex.getMessage()
            );
            return getFallbackReply(
                message,
                context,
                "DevHub AI could not answer just now, so DevHub used the local fallback for this reply."
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
            throw new IllegalStateException("DevHub AI voice transcription is not available until the live AI provider is configured.");
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();

            parts.add(Map.of(
                "text",
                buildTranscriptionPrompt(context)
            ));

            Map<String, Object> audioPart = new HashMap<>();
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mime_type", normalizeAudioMimeType(mimeType));
            inlineData.put("data", Base64.getEncoder().encodeToString(audioData));
            audioPart.put("inline_data", inlineData);
            parts.add(audioPart);

            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                baseUrl + "/" + model + ":generateContent?key=" + apiKey,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            String transcript = extractReplyText(responseEntity.getBody());
            if (transcript == null || transcript.isBlank()) {
                throw new IllegalStateException("DevHub AI returned an empty transcript.");
            }

            return transcript.trim();
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            log.warn(
                "Gemini transcription API error: {} - {}.",
                ex.getStatusCode(),
                ex.getResponseBodyAsString()
            );
            throw new IllegalStateException(
                buildTranscriptionStatusMessage(ex.getStatusCode().value(), ex.getResponseBodyAsString())
            );
        } catch (IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            log.warn("Failed to transcribe audio with Gemini: {}", ex.getMessage());
            throw new IllegalStateException(
                "DevHub AI could not transcribe the voice recording right now. Please try again."
            );
        }
    }

    @Override
    public AIProviderStatus getStatus() {
        boolean configured = isLiveProviderConfigured();
        return AIProviderStatus.builder()
            .enabled(aiEnabled)
            .configured(configured)
            .live(configured)
            .provider("gemini")
            .providerLabel("DevHub AI")
            .source(configured ? "gemini-live" : "local-fallback")
            .sourceLabel(configured ? "DevHub AI online" : "DevHub AI setup needed")
            .message(getStatusMessage())
            .build();
    }

    /**
     * Builds the prompt for the live AI provider by combining system instructions, context, and user message.
     */
    private String buildPrompt(String message, Map<String, Object> context) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append(SYSTEM_PROMPT).append("\n\n");

        // Add context information if available
        if (context != null && !context.isEmpty()) {
            appendContextLine(promptBuilder, "Current Topic", context.get("topic"));
            appendContextLine(promptBuilder, "Course Title", context.get("courseTitle"));
            appendContextLine(promptBuilder, "Topic Title", context.get("topicTitle"));
            appendContextLine(promptBuilder, "Lesson Title", context.get("lessonTitle"));
            appendContextLine(promptBuilder, "Language", context.get("language"));
            appendContextLine(promptBuilder, "User Skill Level", context.get("skillLevel"));
            appendContextLine(promptBuilder, "Requested Tool", context.get("tool"));
            appendContextLine(promptBuilder, "Current Route", context.get("route"));
            appendContextLine(promptBuilder, "Attachment Name", context.get("attachmentName"));

            if (extractImageDataUrl(context) != null) {
                promptBuilder.append("Screenshot Attached: yes\n");
                promptBuilder.append("Image Instruction: inspect the attached image directly and do not say you cannot see the image.\n");
            }

            appendContextBlock(promptBuilder, "Topic Summary", context.get("topicSummary"), 1400);
            appendContextBlock(promptBuilder, "Lesson Content", context.get("lessonContent"), 2200);
            appendContextBlock(promptBuilder, "Selected Code", context.get("selectedCode"), 1400);
            appendContextBlock(promptBuilder, "Code Example", context.get("codeExample"), 1400);
            appendContextBlock(promptBuilder, "Recent Conversation", context.get("recentConversation"), 1000);

            Object recentExercises = context.get("recentExercises");
            if (recentExercises != null) {
                promptBuilder.append("Recent Exercises: ").append(recentExercises.toString()).append("\n");
            }

            promptBuilder.append(
                "Instruction: keep the answer grounded in the active learning context above whenever it is relevant to the user's question.\n"
            );
        }

        // Add the user's message
        promptBuilder.append("User Message: ").append(message).append("\n\n");
        promptBuilder.append("Response:");

        return promptBuilder.toString();
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

    private String extractReplyText(Map<String, Object> responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return null;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            return null;
        }

        Map<String, Object> firstCandidate = candidates.get(0);
        @SuppressWarnings("unchecked")
        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
        if (content == null) {
            return null;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            return null;
        }

        StringBuilder transcript = new StringBuilder();
        for (Map<String, Object> part : parts) {
            Object text = part.get("text");
            if (text instanceof String value && !value.isBlank()) {
                if (transcript.length() > 0) {
                    transcript.append("\n");
                }
                transcript.append(value.trim());
            }
        }

        return transcript.length() > 0 ? transcript.toString() : null;
    }

    private String normalizeAudioMimeType(String mimeType) {
        return mimeType != null && !mimeType.isBlank() ? mimeType : "audio/webm";
    }

    private String buildVisionRetryPrompt(String message, Map<String, Object> context) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("An image is attached.\n");
        promptBuilder.append("Inspect the image directly before answering.\n");
        promptBuilder.append(
            "Describe the main subject, supporting objects, colors, any visible text, and the overall layout or composition.\n"
        );
        appendContextLine(promptBuilder, "Requested Tool", context == null ? null : context.get("tool"));
        appendContextLine(promptBuilder, "Attachment Name", context == null ? null : context.get("attachmentName"));

        String trimmedMessage = message == null ? "" : message.trim();
        if (!trimmedMessage.isEmpty()) {
            promptBuilder.append("User request: ").append(trimmedMessage).append("\n");
        }

        promptBuilder.append(
            "If the user asks for code, provide the code after the visual description and ground it in what is visible.\n"
        );
        promptBuilder.append("Do not say that you cannot see or analyze the image.");
        return promptBuilder.toString();
    }

    private AIProviderReply generateImageReply(String message, Map<String, Object> context) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<String> candidateModels = new ArrayList<>();
        if (imageModel != null && !imageModel.isBlank()) {
            candidateModels.add(imageModel.trim());
        }
        if (!candidateModels.contains("gemini-2.0-flash-preview-image-generation")) {
            candidateModels.add("gemini-2.0-flash-preview-image-generation");
        }

        RuntimeException lastFailure = null;

        for (String candidateModel : candidateModels) {
            try {
                Map<String, Object> requestBody = new LinkedHashMap<>();
                Map<String, Object> content = new LinkedHashMap<>();
                content.put("role", "user");
                content.put(
                    "parts",
                    List.of(
                        Map.of("text", buildImageGenerationPrompt(message, context))
                    )
                );
                requestBody.put("contents", List.of(content));
                requestBody.put(
                    "generationConfig",
                    Map.of("responseModalities", List.of("TEXT", "IMAGE"))
                );

                ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    baseUrl + "/" + candidateModel + ":generateContent?key=" + apiKey,
                    HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    Map.class
                );

                String generatedImageUrl = extractGeneratedImageUrl(responseEntity.getBody());
                if (generatedImageUrl == null || generatedImageUrl.isBlank()) {
                    throw new IllegalStateException("Gemini image generation returned no image.");
                }

                String reply = extractReplyText(responseEntity.getBody());
                if (reply == null || reply.isBlank()) {
                    reply = "I generated this image for you from your request.";
                }

                return AIProviderReply.builder()
                    .content(reply.trim())
                    .generatedImageUrl(generatedImageUrl)
                    .provider("gemini")
                    .providerLabel("DevHub AI")
                    .source("gemini-image")
                    .sourceLabel("DevHub AI image studio")
                    .live(true)
                    .statusMessage("Image generated by DevHub AI online.")
                    .build();
            } catch (HttpClientErrorException | HttpServerErrorException ex) {
                log.warn(
                    "Gemini image generation error with model {}: {} - {}",
                    candidateModel,
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString()
                );
                lastFailure = new IllegalStateException(ex.getResponseBodyAsString(), ex);
            } catch (RuntimeException ex) {
                log.warn("Gemini image generation failed with model {}: {}", candidateModel, ex.getMessage());
                lastFailure = ex;
            }
        }

        throw lastFailure != null
            ? lastFailure
            : new IllegalStateException("Gemini image generation is unavailable right now.");
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
        appendContextLine(promptBuilder, "Topic", context == null ? null : context.get("topicTitle"));
        appendContextLine(promptBuilder, "Lesson", context == null ? null : context.get("lessonTitle"));
        appendContextLine(promptBuilder, "Language", context == null ? null : context.get("language"));
        promptBuilder.append("User request: ").append(message == null ? "" : message.trim()).append("\n");
        promptBuilder.append("Return an actual generated image, not just a text description.");
        return promptBuilder.toString();
    }

    private String extractGeneratedImageUrl(Map<String, Object> responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return null;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }

        Map<String, Object> firstCandidate = candidates.get(0);
        @SuppressWarnings("unchecked")
        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
        if (content == null) {
            return null;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            return null;
        }

        for (Map<String, Object> part : parts) {
            Object rawInlineData = part.get("inlineData");
            Map<?, ?> inlineData;
            if (rawInlineData instanceof Map<?, ?> camelInlineData) {
                inlineData = camelInlineData;
            } else {
                rawInlineData = part.get("inline_data");
                if (!(rawInlineData instanceof Map<?, ?> snakeInlineData)) {
                    continue;
                }
                inlineData = snakeInlineData;
            }

            Object mimeType = inlineData.get("mimeType");
            if (!(mimeType instanceof String mimeTypeValue) || mimeTypeValue.isBlank()) {
                Object snakeMimeType = inlineData.get("mime_type");
                mimeTypeValue = snakeMimeType instanceof String value && !value.isBlank() ? value : "image/png";
            }

            Object imageData = inlineData.get("data");
            if (!(imageData instanceof String imageDataValue) || imageDataValue.isBlank()) {
                continue;
            }

            return "data:" + mimeTypeValue + ";base64," + imageDataValue;
        }

        return null;
    }

    private String buildTranscriptionPrompt(Map<String, Object> context) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append(
            "Transcribe the spoken audio accurately. Return only the transcript text with no labels, commentary, or timestamps."
        );

        if (context == null || context.isEmpty()) {
            promptBuilder.append(" The speaker may use programming and learning terms.");
            return promptBuilder.toString();
        }

        promptBuilder.append(" The speaker may use programming and learning terms.");
        appendContextLine(promptBuilder, "Locale", context.get("locale"));
        appendContextLine(promptBuilder, "Language", context.get("language"));
        appendContextLine(promptBuilder, "Course Title", context.get("courseTitle"));
        appendContextLine(promptBuilder, "Topic Title", context.get("topicTitle"));
        appendContextLine(promptBuilder, "Lesson Title", context.get("lessonTitle"));
        return promptBuilder.toString();
    }

    private boolean looksLikeVisionRefusal(String reply) {
        return reply != null && reply.toLowerCase().matches("(?s).*" + VISION_REFUSAL_PATTERN + ".*");
    }

    private boolean isLiveProviderConfigured() {
        return aiEnabled &&
            geminiEnabled &&
            apiKey != null &&
            !apiKey.isBlank() &&
            !looksLikePlaceholder(apiKey);
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
            .provider("gemini")
            .providerLabel("DevHub AI")
            .source("local-fallback")
            .sourceLabel("Local DevHub fallback")
            .live(false)
            .statusMessage(statusMessage)
            .build();
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

    private String extractImageMimeType(String imageDataUrl) {
        int separatorIndex = imageDataUrl.indexOf(';');
        if (separatorIndex <= 5) {
            return "image/png";
        }

        return imageDataUrl.substring(5, separatorIndex);
    }

    private String extractImageBase64Data(String imageDataUrl) {
        int separatorIndex = imageDataUrl.indexOf(',');
        if (separatorIndex < 0 || separatorIndex + 1 >= imageDataUrl.length()) {
            return "";
        }

        return imageDataUrl.substring(separatorIndex + 1);
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

    private boolean looksLikePlaceholder(String value) {
        String normalized = value.trim().toLowerCase();
        return normalized.startsWith("dummy") ||
            normalized.contains("your_") ||
            normalized.contains("_here") ||
            normalized.contains("replace_me");
    }

    private String buildApiErrorStatusMessage(int statusCode, String responseBody) {
        String normalized = responseBody == null ? "" : responseBody.toLowerCase();

        if (statusCode == 400 || normalized.contains("api key not valid")) {
            return "DevHub AI rejected the current API key. Check the GEMINI_API_KEY value and try again.";
        }

        if (statusCode == 403 || normalized.contains("permission_denied")) {
            return "DevHub AI blocked this request. Check whether the key has API access in Google AI Studio.";
        }

        if (statusCode == 404 || normalized.contains("not found")) {
            return "DevHub AI could not find the configured model. Check GEMINI_MODEL in backend/.env.";
        }

        if (statusCode == 429 || normalized.contains("resource_exhausted") || normalized.contains("quota")) {
            return "DevHub AI free-tier limits were reached for this key, so DevHub used the local fallback for this reply.";
        }

        return "DevHub AI returned an API error, so DevHub used the local fallback for this reply.";
    }

    private String buildTranscriptionStatusMessage(int statusCode, String responseBody) {
        String normalized = responseBody == null ? "" : responseBody.toLowerCase();

        if (statusCode == 400 || normalized.contains("api key not valid")) {
            return "DevHub AI rejected the current API key for voice transcription. Check the GEMINI_API_KEY value and try again.";
        }

        if (statusCode == 403 || normalized.contains("permission_denied")) {
            return "DevHub AI blocked the voice transcription request. Check whether the key has API access in Google AI Studio.";
        }

        if (statusCode == 404 || normalized.contains("not found")) {
            return "DevHub AI could not find the configured model for voice transcription. Check GEMINI_MODEL in backend/.env.";
        }

        if (statusCode == 429 || normalized.contains("resource_exhausted") || normalized.contains("quota")) {
            return "DevHub AI reached its quota for voice transcription right now. Please try again in a bit.";
        }

        return "DevHub AI could not transcribe the voice recording right now. Please try again.";
    }

    private String getStatusMessage() {
        if (!aiEnabled) {
            return "AI chat is disabled in backend configuration.";
        }

        if (!geminiEnabled) {
            return "DevHub AI is disabled in backend configuration.";
        }

        if (apiKey == null || apiKey.isBlank()) {
            return "Add your GEMINI_API_KEY in backend/.env to turn on DevHub AI online. Until then, DevHub will use the local fallback.";
        }

        if (looksLikePlaceholder(apiKey)) {
            return "Replace the placeholder GEMINI_API_KEY in backend/.env with a real API key for DevHub AI. Until then, DevHub will use the local fallback.";
        }

        return "DevHub AI online is connected.";
    }
}

