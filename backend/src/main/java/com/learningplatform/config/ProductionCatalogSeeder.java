package com.learningplatform.config;

import com.learningplatform.model.entity.Course;
import com.learningplatform.model.entity.Lesson;
import com.learningplatform.model.entity.Topic;
import com.learningplatform.model.entity.TopicCodeExample;
import com.learningplatform.model.enums.Difficulty;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.TopicCodeExampleRepository;
import com.learningplatform.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductionCatalogSeeder implements ApplicationRunner {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;
    private final TopicCodeExampleRepository topicCodeExampleRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedCourses();
        seedTopics();
    }

    private void seedCourses() {
        ensureCourse(
                "HTML Tutorial",
                "html-tutorial",
                "Learn the basics of HTML to build web pages.",
                "Web Development",
                Difficulty.BEGINNER,
                new BigDecimal("10.3"),
                1,
                true,
                true,
                List.of(
                        lessonSeed(
                                "HTML HOME",
                                "html-home",
                                "# HTML HOME\n\nWelcome to HTML. Start with the structure of a web page and the tags you use every day.",
                                "<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello HTML</h1>\n  <p>Welcome to DevHub.</p>\n</body>\n</html>",
                                1
                        ),
                        lessonSeed(
                                "HTML Introduction",
                                "html-introduction",
                                "# HTML Introduction\n\nHTML is the markup language that structures content on the web.",
                                "<h1>Welcome</h1>\n<p>This page is built with HTML.</p>",
                                2
                        )
                )
        );

        ensureCourse(
                "CSS Tutorial",
                "css-tutorial",
                "Learn CSS from scratch and style modern interfaces.",
                "Web Development",
                Difficulty.BEGINNER,
                new BigDecimal("12.8"),
                2,
                true,
                true,
                List.of(
                        lessonSeed(
                                "CSS HOME",
                                "css-home",
                                "# CSS HOME\n\nStart styling your pages with selectors, colors, spacing, and layout.",
                                "body {\n  font-family: sans-serif;\n  color: #0f172a;\n}\n",
                                1
                        ),
                        lessonSeed(
                                "CSS Introduction",
                                "css-introduction",
                                "# CSS Introduction\n\nCSS controls how HTML content looks and responds on screen.",
                                "h1 {\n  color: #0ea5e9;\n}\n",
                                2
                        )
                )
        );

        ensureCourse(
                "Java Tutorial",
                "java-tutorial",
                "Learn Java from scratch with clear object-oriented lessons and practical examples.",
                "Programming",
                Difficulty.BEGINNER,
                new BigDecimal("26.0"),
                3,
                true,
                true,
                List.of(
                        lessonSeed(
                                "Java Tutorial",
                                "java-tutorial-intro",
                                "# Java Tutorial\n\nJava is a powerful object-oriented language used for web, mobile, and enterprise software.",
                                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java\");\n    }\n}\n",
                                1
                        ),
                        lessonSeed(
                                "Java Introduction",
                                "java-introduction",
                                "# Java Introduction\n\nStart with classes, the main method, and Java's write-once-run-anywhere model.",
                                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Java Intro\");\n    }\n}\n",
                                2
                        )
                )
        );

        ensureCourse(
                "Python Tutorial",
                "python-tutorial",
                "Learn Python from scratch for automation, data work, and backend fundamentals.",
                "Programming",
                Difficulty.BEGINNER,
                new BigDecimal("18.5"),
                4,
                true,
                false,
                List.of(
                        lessonSeed(
                                "Python HOME",
                                "python-home",
                                "# Python HOME\n\nPython is readable, practical, and a strong first programming language.",
                                "print(\"Hello Python\")\n",
                                1
                        ),
                        lessonSeed(
                                "Python Introduction",
                                "python-introduction",
                                "# Python Introduction\n\nLearn variables, indentation, and how Python code reads almost like plain English.",
                                "name = \"DevHub\"\nprint(name)\n",
                                2
                        )
                )
        );
    }

    private void ensureCourse(
            String title,
            String slug,
            String description,
            String category,
            Difficulty difficulty,
            BigDecimal estimatedHours,
            int orderIndex,
            boolean featured,
            boolean published,
            List<SeedLesson> lessons
    ) {
        Course course = courseRepository.findBySlug(slug).orElseGet(() ->
                courseRepository.save(
                        Course.builder()
                                .title(title)
                                .slug(slug)
                                .description(description)
                                .longDescription(description)
                                .category(category)
                                .difficulty(difficulty)
                                .estimatedHours(estimatedHours)
                                .orderIndex(orderIndex)
                                .isFeatured(featured)
                                .isPublished(published)
                                .build()
                )
        );

        lessons.forEach(lesson -> ensureLesson(course, lesson));
    }

    private void ensureLesson(Course course, SeedLesson lessonSeed) {
        if (lessonRepository.findByCourseIdAndSlug(course.getId(), lessonSeed.slug()).isPresent()) {
            return;
        }

        lessonRepository.save(
                Lesson.builder()
                        .course(course)
                        .title(lessonSeed.title())
                        .slug(lessonSeed.slug())
                        .content(lessonSeed.content())
                        .contentHtml(lessonSeed.content())
                        .codeExample(lessonSeed.codeExample())
                        .orderIndex(lessonSeed.orderIndex())
                        .estimatedMinutes(10)
                        .isPublished(true)
                        .isPremium(false)
                        .build()
        );
    }

    private void seedTopics() {
        ensureTopic(
                "html",
                "HTML Tutorial",
                "html-tutorial",
                "Learn HTML basics, page structure, and the core tags used in every web page.",
                "HTML gives structure to your web content with headings, paragraphs, links, and sections.",
                "HTML basics\nDocument structure\nCommon tags",
                "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello HTML</h1>\n</body>\n</html>\n"
        );
        ensureTopic(
                "css",
                "CSS Tutorial",
                "css-tutorial",
                "Learn CSS selectors, spacing, colors, and layout fundamentals.",
                "CSS styles your HTML with colors, spacing, typography, and responsive layouts.",
                "Selectors\nSpacing\nLayout",
                "body {\n  background: #f8fafc;\n  color: #0f172a;\n}\n"
        );
        ensureTopic(
                "java",
                "Java Tutorial",
                "java-tutorial",
                "Learn Java syntax, object-oriented thinking, and practical examples.",
                "Java is a strongly typed programming language used across backend, Android, and enterprise systems.",
                "Classes\nMethods\nOOP basics",
                "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello Java\");\n  }\n}\n"
        );
        ensureTopic(
                "python",
                "Python Tutorial",
                "python-tutorial",
                "Learn Python syntax, variables, control flow, and scripting basics.",
                "Python is beginner-friendly and widely used for automation, data analysis, and backend APIs.",
                "Variables\nIndentation\nFunctions",
                "name = 'DevHub'\nprint(name)\n"
        );
    }

    private void ensureTopic(
            String language,
            String title,
            String slug,
            String description,
            String simpleExplanation,
            String keyPoints,
            String code
    ) {
        Topic topic = topicRepository.findByLanguageAndSlug(language, slug).orElseGet(() ->
                topicRepository.save(
                        Topic.builder()
                                .language(language)
                                .title(title)
                                .slug(slug)
                                .description(description)
                                .whyLearn("This topic gives you a stable starting point while the full catalog continues syncing.")
                                .simpleExplanation(simpleExplanation)
                                .keyPoints(keyPoints.replace("\\n", "\n"))
                                .difficulty("beginner")
                                .orderIndex(1)
                                .isPremium(false)
                                .build()
                )
        );

        if (topicCodeExampleRepository.findByTopicId(topic.getId()).isEmpty()) {
            topicCodeExampleRepository.save(
                    TopicCodeExample.builder()
                            .topic(topic)
                            .title(title + " Example")
                            .description("Starter example for " + title)
                            .code(code)
                            .codeLanguage(language)
                            .output("")
                            .orderIndex(1)
                            .build()
            );
        }
    }

    private SeedLesson lessonSeed(String title, String slug, String content, String codeExample, int orderIndex) {
        return new SeedLesson(title, slug, content, codeExample, orderIndex);
    }

    private record SeedLesson(
            String title,
            String slug,
            String content,
            String codeExample,
            int orderIndex
    ) {}
}
