package com.learningplatform.service.impl;

import com.learningplatform.model.dto.ProgrammingNewsArticleResponse;
import com.learningplatform.model.dto.ProgrammingNewsResponse;
import com.learningplatform.model.dto.ProgrammingNewsStatusBar;
import com.learningplatform.service.ProgrammingNewsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProgrammingNewsServiceImpl implements ProgrammingNewsService {

    private static final Logger logger = LoggerFactory.getLogger(ProgrammingNewsServiceImpl.class);
    private static final Duration CACHE_TTL = Duration.ofMinutes(12);
    private static final int DEFAULT_LIMIT = 9;
    private static final int MAX_LIMIT = 12;
    private static final String MEDIA_TYPE_ARTICLE = "article";
    private static final String MEDIA_TYPE_VIDEO = "video";
    private static final Pattern IMAGE_PATTERN = Pattern.compile("<img[^>]+src=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);
    private static final Pattern TAG_PATTERN = Pattern.compile("<[^>]+>");

    private static final List<FeedSource> FEED_SOURCES = List.of(
            new FeedSource(
                    "openai-news",
                    "AI Briefing",
                    "OpenAI News",
                    "https://openai.com/news/rss.xml",
                    "Global",
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-emerald-500/20", "to-teal-500/20"),
                    MEDIA_TYPE_ARTICLE
            ),
            new FeedSource(
                    "huggingface-blog",
                    "AI Models",
                    "Hugging Face",
                    "https://huggingface.co/blog/feed.xml",
                    "Global",
                    "https://images.unsplash.com/photo-1686191128892-b1d2f9e49fef?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-fuchsia-500/20", "to-orange-500/20"),
                    MEDIA_TYPE_ARTICLE
            ),
            new FeedSource(
                    "github-blog",
                    "Developer News",
                    "GitHub Blog",
                    "https://github.blog/feed/",
                    "Global",
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-sky-500/20", "to-cyan-500/20"),
                    MEDIA_TYPE_ARTICLE
            ),
            new FeedSource(
                    "devto-programming",
                    "Programming Guides",
                    "DEV Community",
                    "https://dev.to/feed/tag/programming",
                    "Global",
                    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-violet-500/20", "to-fuchsia-500/20"),
                    MEDIA_TYPE_ARTICLE
            ),
            new FeedSource(
                    "martin-fowler",
                    "Software Design",
                    "Martin Fowler",
                    "https://martinfowler.com/feed.atom",
                    "Global",
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-amber-500/20", "to-rose-500/20"),
                    MEDIA_TYPE_ARTICLE
            ),
            new FeedSource(
                    "freecodecamp-videos",
                    "Programming Videos",
                    "freeCodeCamp",
                    "https://www.youtube.com/feeds/videos.xml?channel_id=UC8butISFwT-Wl7EV0hUK0BQ",
                    "YouTube",
                    "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-red-500/20", "to-orange-500/20"),
                    MEDIA_TYPE_VIDEO
            ),
            new FeedSource(
                    "fireship-videos",
                    "Tech Videos",
                    "Fireship",
                    "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA",
                    "YouTube",
                    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
                    List.of("from-indigo-500/20", "to-sky-500/20"),
                    MEDIA_TYPE_VIDEO
            )
    );

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    private volatile CachedResponse cachedResponse;

    @Override
    public ProgrammingNewsResponse getProgrammingNews(int limit) {
        int safeLimit = Math.max(3, Math.min(limit <= 0 ? DEFAULT_LIMIT : limit, MAX_LIMIT));
        CachedResponse snapshot = cachedResponse;

        if (snapshot != null && !snapshot.isExpired()) {
            return trimResponse(snapshot.response(), safeLimit);
        }

        synchronized (this) {
            snapshot = cachedResponse;
            if (snapshot != null && !snapshot.isExpired()) {
                return trimResponse(snapshot.response(), safeLimit);
            }

            ProgrammingNewsResponse freshResponse = buildNewsResponse(MAX_LIMIT);
            cachedResponse = new CachedResponse(freshResponse, Instant.now().plus(CACHE_TTL));
            return trimResponse(freshResponse, safeLimit);
        }
    }

    private ProgrammingNewsResponse buildNewsResponse(int limit) {
        List<ProgrammingNewsArticleResponse> articles = new ArrayList<>();

        for (FeedSource source : FEED_SOURCES) {
            try {
                int perSourceLimit = MEDIA_TYPE_VIDEO.equals(source.mediaType()) ? 3 : 4;
                articles.addAll(fetchFeedArticles(source, perSourceLimit));
            } catch (Exception error) {
                logger.warn("Failed to fetch programming news from {}", source.feedUrl(), error);
            }
        }

        if (articles.isEmpty()) {
            articles = buildFallbackArticles();
        }

        List<ProgrammingNewsArticleResponse> deduplicatedArticles = articles.stream()
                .filter(article -> article.getTitle() != null && !article.getTitle().isBlank())
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                article -> article.getTitle().trim().toLowerCase(Locale.ROOT),
                                article -> article,
                                (first, second) -> first,
                                LinkedHashMap::new
                        ),
                        map -> new ArrayList<>(map.values())
                ));

        deduplicatedArticles.sort(
                Comparator.comparing(
                        ProgrammingNewsServiceImpl::parsePublishedAtOrNow,
                        Comparator.reverseOrder()
                )
        );

        List<ProgrammingNewsArticleResponse> limitedArticles = selectBalancedArticles(deduplicatedArticles, limit);

        return ProgrammingNewsResponse.builder()
                .title("Fresh Programming, AI, and Tech Videos")
                .subtitle("Live articles and videos about AI, programming, tools, and developer trends so learners can read, watch, and explore from one place.")
                .fetchedAt(Instant.now().toString())
                .sources(buildStatusBars(limitedArticles))
                .articles(limitedArticles)
                .build();
    }

    private List<ProgrammingNewsArticleResponse> fetchFeedArticles(FeedSource source, int perSourceLimit) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(source.feedUrl()))
                .timeout(Duration.ofSeconds(10))
                .header("User-Agent", "DevHubNewsFetcher/1.0")
                .header("Accept", "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8")
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("Feed request failed with status " + response.statusCode());
        }

        Document document = parseXml(response.body());
        NodeList items = document.getElementsByTagName("item");
        if (items.getLength() == 0) {
            items = document.getElementsByTagName("entry");
        }

        List<ProgrammingNewsArticleResponse> results = new ArrayList<>();

        for (int index = 0; index < items.getLength() && results.size() < perSourceLimit; index++) {
            Node node = items.item(index);
            if (node.getNodeType() != Node.ELEMENT_NODE) {
                continue;
            }

            Element item = (Element) node;
            String title = cleanText(readNodeText(item, "title"));
            String articleUrl = extractArticleUrl(item);

            if (title.isBlank() || articleUrl.isBlank()) {
                continue;
            }

            String descriptionHtml = firstNonBlank(
                    readNodeText(item, "description"),
                    readNodeText(item, "content:encoded"),
                    readNodeText(item, "summary"),
                    readNodeText(item, "media:description"),
                    readNodeText(item, "content")
            );

            String descriptionText = cleanText(descriptionHtml);
            String image = firstNonBlank(
                    extractImageUrl(item),
                    extractImageUrl(descriptionHtml),
                    source.defaultImage()
            );
            String publishedAt = firstNonBlank(
                    parsePublishedAt(item),
                    Instant.now().toString()
            );
            String sourceName = firstNonBlank(extractAuthorName(item), source.subcategory());

            results.add(
                    ProgrammingNewsArticleResponse.builder()
                            .id(source.id() + "-" + index)
                            .title(title)
                            .category(inferCategory(title, source.category(), source.mediaType()))
                            .subcategory(source.subcategory())
                            .mediaType(source.mediaType())
                            .actionLabel(buildActionLabel(source.mediaType()))
                            .timeAgo(formatTimeAgo(publishedAt))
                            .location(source.location())
                            .image(image)
                            .gradientColors(source.gradientColors())
                            .content(buildContentParagraphs(descriptionText, sourceName, source.mediaType()))
                            .articleUrl(articleUrl)
                            .sourceName(sourceName)
                            .publishedAt(publishedAt)
                            .build()
            );
        }

        return results;
    }

    private Document parseXml(String body) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(false);
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setExpandEntityReferences(false);

        Document document = factory.newDocumentBuilder().parse(new InputSource(new StringReader(body)));
        document.getDocumentElement().normalize();
        return document;
    }

    private List<ProgrammingNewsArticleResponse> buildFallbackArticles() {
        Instant now = Instant.now();

        return List.of(
                ProgrammingNewsArticleResponse.builder()
                        .id("fallback-article-1")
                        .title("Live programming and AI stories will appear here shortly")
                        .category("Programming News")
                        .subcategory("DevHub fallback")
                        .mediaType(MEDIA_TYPE_ARTICLE)
                        .actionLabel("Read article")
                        .timeAgo("Just now")
                        .location("Online")
                        .image("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80")
                        .gradientColors(List.of("from-sky-500/20", "to-cyan-500/20"))
                        .content(List.of(
                                "DevHub could not reach the live feeds for a moment, so this card keeps the news section available while the sources recover.",
                                "Refresh again shortly to load current programming articles, AI updates, and developer videos from the live sources."
                        ))
                        .articleUrl("https://github.blog/")
                        .sourceName("DevHub fallback")
                        .publishedAt(now.toString())
                        .build(),
                ProgrammingNewsArticleResponse.builder()
                        .id("fallback-article-2")
                        .title("OpenAI News is one of the live AI sources in this feed")
                        .category("AI Briefing")
                        .subcategory("OpenAI News")
                        .mediaType(MEDIA_TYPE_ARTICLE)
                        .actionLabel("Read article")
                        .timeAgo("Live source")
                        .location("Global")
                        .image("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80")
                        .gradientColors(List.of("from-emerald-500/20", "to-teal-500/20"))
                        .content(List.of(
                                "This feed includes live AI product and research updates so learners can keep an eye on tools and model releases while they study."
                        ))
                        .articleUrl("https://openai.com/news/")
                        .sourceName("OpenAI News")
                        .publishedAt(now.minus(Duration.ofMinutes(5)).toString())
                        .build(),
                ProgrammingNewsArticleResponse.builder()
                        .id("fallback-video-1")
                        .title("Programming videos will also show up in this same section")
                        .category("Programming Videos")
                        .subcategory("freeCodeCamp")
                        .mediaType(MEDIA_TYPE_VIDEO)
                        .actionLabel("Watch video")
                        .timeAgo("Live source")
                        .location("YouTube")
                        .image("https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=80")
                        .gradientColors(List.of("from-red-500/20", "to-orange-500/20"))
                        .content(List.of(
                                "DevHub now mixes articles with videos in the same live feed, so users can choose between reading a story or watching a walkthrough.",
                                "When the live feeds are available again, this card will be replaced by current videos from the configured developer channels."
                        ))
                        .articleUrl("https://www.youtube.com/@freecodecamp")
                        .sourceName("freeCodeCamp")
                        .publishedAt(now.minus(Duration.ofMinutes(10)).toString())
                        .build()
        );
    }

    private List<ProgrammingNewsStatusBar> buildStatusBars(List<ProgrammingNewsArticleResponse> articles) {
        if (articles == null || articles.isEmpty()) {
            return List.of();
        }

        Map<String, SourceStats> groupedSources = new LinkedHashMap<>();

        for (ProgrammingNewsArticleResponse article : articles) {
            String label = firstNonBlank(article.getSourceName(), article.getSubcategory(), "Live source");

            groupedSources.compute(label, (ignored, existing) -> {
                if (existing == null) {
                    return new SourceStats(article.getCategory(), label, 1);
                }
                return existing.increment();
            });
        }

        int sourceCount = Math.max(groupedSources.size(), 1);
        List<ProgrammingNewsStatusBar> statusBars = new ArrayList<>();
        int index = 0;

        for (SourceStats stats : groupedSources.values()) {
            double opacity = sourceCount == 1
                    ? 1.0
                    : Math.max(0.4, 1.0 - ((double) index / (sourceCount - 1)) * 0.55);

            statusBars.add(
                    ProgrammingNewsStatusBar.builder()
                            .id("source-" + slugify(stats.label()))
                            .category(stats.category())
                            .subcategory(stats.label())
                            .length(stats.count())
                            .opacity(opacity)
                            .build()
            );
            index++;
        }

        return statusBars;
    }

    private ProgrammingNewsResponse trimResponse(ProgrammingNewsResponse response, int limit) {
        List<ProgrammingNewsArticleResponse> trimmedArticles = selectBalancedArticles(response.getArticles(), limit);

        return ProgrammingNewsResponse.builder()
                .title(response.getTitle())
                .subtitle(response.getSubtitle())
                .fetchedAt(response.getFetchedAt())
                .sources(buildStatusBars(trimmedArticles))
                .articles(trimmedArticles)
                .build();
    }

    private List<ProgrammingNewsArticleResponse> selectBalancedArticles(
            List<ProgrammingNewsArticleResponse> articles,
            int limit
    ) {
        if (articles == null || articles.isEmpty() || limit <= 0) {
            return List.of();
        }

        List<ProgrammingNewsArticleResponse> sortedArticles = articles.stream()
                .sorted(
                        Comparator.comparing(
                                ProgrammingNewsServiceImpl::parsePublishedAtOrNow,
                                Comparator.reverseOrder()
                        )
                )
                .toList();

        List<ProgrammingNewsArticleResponse> videoArticles = sortedArticles.stream()
                .filter(article -> MEDIA_TYPE_VIDEO.equals(article.getMediaType()))
                .toList();

        int minimumVideoCount = Math.min(
                videoArticles.size(),
                limit >= 9 ? 3 : limit >= 6 ? 2 : limit >= 3 ? 1 : 0
        );

        if (minimumVideoCount <= 0) {
            return sortedArticles.stream().limit(limit).toList();
        }

        LinkedHashMap<String, ProgrammingNewsArticleResponse> selectedArticles = new LinkedHashMap<>();

        for (int index = 0; index < minimumVideoCount; index++) {
            ProgrammingNewsArticleResponse article = videoArticles.get(index);
            selectedArticles.put(article.getId(), article);
        }

        for (ProgrammingNewsArticleResponse article : sortedArticles) {
            if (selectedArticles.size() >= limit) {
                break;
            }
            selectedArticles.putIfAbsent(article.getId(), article);
        }

        return selectedArticles.values().stream()
                .sorted(
                        Comparator.comparing(
                                ProgrammingNewsServiceImpl::parsePublishedAtOrNow,
                                Comparator.reverseOrder()
                        )
                )
                .limit(limit)
                .toList();
    }

    private static Instant parsePublishedAtOrNow(ProgrammingNewsArticleResponse article) {
        try {
            return Instant.parse(article.getPublishedAt());
        } catch (Exception ignored) {
            return Instant.now();
        }
    }

    private String inferCategory(String title, String defaultCategory, String mediaType) {
        String normalized = title.toLowerCase(Locale.ROOT);

        if (normalized.contains("ai") || normalized.contains("llm") || normalized.contains("model") || normalized.contains("agent")) {
            return MEDIA_TYPE_VIDEO.equals(mediaType) ? "AI Video" : "AI Briefing";
        }
        if (normalized.contains("security") || normalized.contains("breach") || normalized.contains("vulnerability")) {
            return "Security";
        }
        if (normalized.contains("release") || normalized.contains("framework") || normalized.contains("library") || normalized.contains("tool")) {
            return "Dev Tools";
        }
        if (normalized.contains("architecture") || normalized.contains("refactor") || normalized.contains("design")) {
            return "Software Design";
        }
        if (normalized.contains("javascript") || normalized.contains("typescript") || normalized.contains("react")
                || normalized.contains("python") || normalized.contains("java")) {
            return MEDIA_TYPE_VIDEO.equals(mediaType) ? "Programming Video" : "Programming Guides";
        }
        if (normalized.contains("github") || normalized.contains("open source")) {
            return "Open Source";
        }

        return defaultCategory;
    }

    private String buildActionLabel(String mediaType) {
        return MEDIA_TYPE_VIDEO.equals(mediaType) ? "Watch video" : "Read article";
    }

    private List<String> buildContentParagraphs(String description, String sourceName, String mediaType) {
        if (description == null || description.isBlank()) {
            if (MEDIA_TYPE_VIDEO.equals(mediaType)) {
                return List.of(
                        "Open this video to watch the latest update from " + sourceName + ".",
                        "DevHub keeps the original link attached so users can jump directly to the source channel."
                );
            }

            return List.of(
                    "Open this story to read the latest programming or AI update from " + sourceName + ".",
                    "DevHub keeps the original article link attached so users can continue reading on the source site."
            );
        }

        List<String> sentences = Arrays.stream(description.split("(?<=[.!?])\\s+"))
                .map(String::trim)
                .filter(sentence -> !sentence.isBlank())
                .limit(6)
                .toList();

        if (sentences.isEmpty()) {
            return List.of(description);
        }

        List<String> paragraphs = new ArrayList<>();
        StringBuilder builder = new StringBuilder();

        for (int index = 0; index < sentences.size(); index++) {
            if (builder.length() > 0) {
                builder.append(' ');
            }
            builder.append(sentences.get(index));

            if ((index + 1) % 2 == 0 || index == sentences.size() - 1) {
                paragraphs.add(builder.toString().trim());
                builder = new StringBuilder();
            }
        }

        if (paragraphs.size() == 1) {
            paragraphs.add(
                    MEDIA_TYPE_VIDEO.equals(mediaType)
                            ? "Open the full video from " + sourceName + " to watch the rest of the walkthrough."
                            : "Open the full article from " + sourceName + " to continue reading the latest context."
            );
        }

        return paragraphs.stream()
                .filter(paragraph -> !paragraph.isBlank())
                .toList();
    }

    private String extractArticleUrl(Element item) {
        String directLink = cleanText(readNodeText(item, "link"));
        if (!directLink.isBlank() && directLink.startsWith("http")) {
            return directLink;
        }

        NodeList links = item.getElementsByTagName("link");
        for (int index = 0; index < links.getLength(); index++) {
            Node node = links.item(index);
            if (node instanceof Element linkElement) {
                String href = cleanText(linkElement.getAttribute("href"));
                if (!href.isBlank()) {
                    return href;
                }
            }
        }

        return "";
    }

    private String extractAuthorName(Element item) {
        NodeList authorNodes = item.getElementsByTagName("author");
        for (int index = 0; index < authorNodes.getLength(); index++) {
            Node node = authorNodes.item(index);
            if (node instanceof Element authorElement) {
                String name = cleanText(readNodeText(authorElement, "name"));
                if (!name.isBlank()) {
                    return name;
                }
            }
        }

        return firstNonBlank(
                readNodeText(item, "dc:creator"),
                readNodeText(item, "author")
        );
    }

    private String parsePublishedAt(Element item) {
        List<String> candidates = List.of(
                readNodeText(item, "pubDate"),
                readNodeText(item, "published"),
                readNodeText(item, "updated"),
                readNodeText(item, "dc:date")
        );

        for (String candidate : candidates) {
            String parsed = parseDate(candidate);
            if (!parsed.isBlank()) {
                return parsed;
            }
        }

        return "";
    }

    private String parseDate(String rawDate) {
        if (rawDate == null || rawDate.isBlank()) {
            return "";
        }

        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.RFC_1123_DATE_TIME,
                DateTimeFormatter.ISO_OFFSET_DATE_TIME,
                DateTimeFormatter.ISO_ZONED_DATE_TIME,
                DateTimeFormatter.ISO_INSTANT
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                if (formatter == DateTimeFormatter.ISO_INSTANT) {
                    return Instant.parse(rawDate).toString();
                }

                return ZonedDateTime.parse(rawDate, formatter).toInstant().toString();
            } catch (DateTimeParseException ignored) {
                // Try next formatter.
            }
        }

        try {
            return OffsetDateTime.parse(rawDate).toInstant().toString();
        } catch (DateTimeParseException ignored) {
            return "";
        }
    }

    private String formatTimeAgo(String publishedAt) {
        Instant publishedInstant;
        try {
            publishedInstant = Instant.parse(publishedAt);
        } catch (Exception ignored) {
            return "Recently";
        }

        Duration age = Duration.between(publishedInstant, Instant.now());
        if (age.isNegative()) {
            return "Recently";
        }

        long minutes = age.toMinutes();
        if (minutes < 1) {
            return "Just now";
        }
        if (minutes < 60) {
            return minutes + " min ago";
        }

        long hours = age.toHours();
        if (hours < 24) {
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        }

        long days = age.toDays();
        if (days < 7) {
            return days + (days == 1 ? " day ago" : " days ago");
        }

        return DateTimeFormatter.ofPattern("MMM d", Locale.ENGLISH)
                .withZone(ZoneId.systemDefault())
                .format(publishedInstant);
    }

    private String extractImageUrl(Element item) {
        for (String tagName : List.of("media:content", "media:thumbnail", "enclosure")) {
            NodeList nodes = item.getElementsByTagName(tagName);
            for (int index = 0; index < nodes.getLength(); index++) {
                Node node = nodes.item(index);
                if (node instanceof Element element) {
                    String url = cleanText(element.getAttribute("url"));
                    String type = cleanText(element.getAttribute("type"));
                    if (!url.isBlank() && (type.isBlank() || type.startsWith("image"))) {
                        return url;
                    }
                }
            }
        }

        return "";
    }

    private String extractImageUrl(String html) {
        if (html == null || html.isBlank()) {
            return "";
        }

        Matcher matcher = IMAGE_PATTERN.matcher(html);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return "";
    }

    private String readNodeText(Element parent, String tagName) {
        NodeList nodes = parent.getElementsByTagName(tagName);
        if (nodes.getLength() == 0) {
            return "";
        }

        Node node = nodes.item(0);
        if (node == null) {
            return "";
        }

        return node.getTextContent();
    }

    private String cleanText(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        String cleaned = value
                .replace("<![CDATA[", "")
                .replace("]]>", "");
        cleaned = TAG_PATTERN.matcher(cleaned).replaceAll(" ");
        cleaned = HtmlUtils.htmlUnescape(cleaned);
        cleaned = cleaned.replaceAll("\\s+", " ").trim();
        return cleaned;
    }

    private String firstNonBlank(String... values) {
        return Arrays.stream(values)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .findFirst()
                .orElse("");
    }

    private String slugify(String value) {
        return value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private record FeedSource(
            String id,
            String category,
            String subcategory,
            String feedUrl,
            String location,
            String defaultImage,
            List<String> gradientColors,
            String mediaType
    ) {
    }

    private record SourceStats(String category, String label, int count) {
        private SourceStats increment() {
            return new SourceStats(category, label, count + 1);
        }
    }

    private record CachedResponse(ProgrammingNewsResponse response, Instant expiresAt) {
        private boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }
}
