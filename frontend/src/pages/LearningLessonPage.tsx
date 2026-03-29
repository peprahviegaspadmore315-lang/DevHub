import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { learningApi } from '../services/learningService';
import { CodeBlock, YouTubePlayer } from '../components/learning';
import { OrbitalLoader } from '../components/ui/orbital-loader';
import { useAIAssistant } from '../contexts/AIAssistantContext';
import type { Lesson } from '../services/learningService';

const LearningLessonPage = () => {
  const { languageSlug, topicSlug, lessonSlug } = useParams<{
    languageSlug: string;
    topicSlug: string;
    lessonSlug: string;
  }>();
  const { setLearningContext, clearLearningContext } = useAIAssistant();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!languageSlug || !topicSlug || !lessonSlug) return;

      try {
        setLoading(true);
        const data = await learningApi.getLesson(languageSlug, topicSlug, lessonSlug);
        setLesson(data);
        setCompleted(data.isCompleted || false);
      } catch (err) {
        setError('Failed to load lesson');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [languageSlug, topicSlug, lessonSlug]);

  useEffect(() => {
    if (!lesson) {
      clearLearningContext();
      return;
    }

    setLearningContext({
      source: 'learning-lesson-page',
      route: window.location.pathname + window.location.search,
      language: languageSlug || undefined,
      topicSlug: topicSlug || undefined,
      topicTitle: lesson.topicName,
      topicSummary: lesson.content,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonContent: lesson.content,
      codeExample: lesson.codeExamples?.[0]?.code || '',
    });

    return () => {
      clearLearningContext();
    };
  }, [clearLearningContext, languageSlug, lesson, setLearningContext, topicSlug]);

  const handleMarkComplete = async () => {
    if (!lesson) return;

    try {
      await learningApi.updateProgress({
        lessonId: lesson.id,
        completed: true,
        progressPercent: 100,
      });
      setCompleted(true);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const renderInlineMarkdown = (text: string, keyPrefix: string) => {
    return text
      .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
      .filter(Boolean)
      .map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={`${keyPrefix}-code-${index}`}
              className="rounded bg-gray-900 px-1.5 py-0.5 font-mono text-sm text-sky-300"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }

        return <span key={`${keyPrefix}-text-${index}`}>{part}</span>;
      });
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];

      if (line.startsWith('```')) {
        const language = line.substring(3).trim() || 'text';
        const codeLines: string[] = [];
        index += 1;

        while (index < lines.length && !lines[index].startsWith('```')) {
          codeLines.push(lines[index]);
          index += 1;
        }

        elements.push(
          <div
            key={`code-${elements.length}`}
            className="my-6 overflow-hidden rounded-xl border border-gray-700/60 bg-gray-900"
          >
            <div className="border-b border-gray-700 bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              {language}
            </div>
            <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-gray-200">
              <code className="font-mono whitespace-pre">{codeLines.join('\n')}</code>
            </pre>
          </div>
        );

        index += 1;
        continue;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold text-white mt-8 mb-4">
            {renderInlineMarkdown(line.substring(2), `h1-${index}`)}
          </h1>
        );
        index += 1;
        continue;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-bold text-white mt-6 mb-3">
            {renderInlineMarkdown(line.substring(3), `h2-${index}`)}
          </h2>
        );
        index += 1;
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-white mt-4 mb-2">
            {renderInlineMarkdown(line.substring(4), `h3-${index}`)}
          </h3>
        );
        index += 1;
        continue;
      }

      if (line.startsWith('- ')) {
        const items: string[] = [];

        while (index < lines.length && lines[index].startsWith('- ')) {
          items.push(lines[index].substring(2));
          index += 1;
        }

        elements.push(
          <ul key={`list-${elements.length}`} className="mb-4 ml-6 list-disc space-y-1 text-gray-300">
            {items.map((item, itemIndex) => (
              <li key={`list-item-${itemIndex}`}>
                {renderInlineMarkdown(item, `list-${elements.length}-${itemIndex}`)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      if (line.startsWith('| ')) {
        const cells = line.split('|').filter((c) => c.trim());
        const isHeader = cells.every((c) => c.trim().startsWith('-'));
        if (isHeader) {
          index += 1;
          continue;
        }

        elements.push(
          <div key={`table-${index}`} className="mb-2 flex gap-4 border-b border-gray-700 pb-2 text-sm">
            {cells.map((cell, cellIndex) => (
              <div key={cellIndex} className={`flex-1 ${cellIndex === 0 ? 'font-medium' : ''}`}>
                {renderInlineMarkdown(cell.trim(), `table-${index}-${cellIndex}`)}
              </div>
            ))}
          </div>
        );
        index += 1;
        continue;
      }

      if (line.trim() === '') {
        elements.push(<div key={`space-${index}`} className="h-2" />);
        index += 1;
        continue;
      }

      elements.push(
        <p key={`p-${index}`} className="text-gray-300 mb-4">
          {renderInlineMarkdown(line, `p-${index}`)}
        </p>
      );
      index += 1;
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <OrbitalLoader
          message="Loading this lesson and preparing topic-aware AI help..."
          size="lg"
          tone="light"
        />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Lesson not found'}</p>
          <Link
            to={`/learn/${languageSlug}/${topicSlug}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link to="/learn" className="text-gray-400 hover:text-white transition-colors">
                Languages
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link
                to={`/learn/${languageSlug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {lesson.languageName}
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link
                to={`/learn/${languageSlug}/${topicSlug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {lesson.topicName}
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white font-medium truncate max-w-[200px]">
              {lesson.title}
            </li>
          </ol>
        </motion.nav>

        {/* Lesson Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.durationMinutes} min
            </span>
            <span className="capitalize">{lesson.difficulty}</span>
            {completed && (
              <span className="flex items-center gap-1 text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed
              </span>
            )}
          </div>
        </motion.header>

        {/* Lesson Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert max-w-none"
        >
          {renderMarkdown(lesson.content)}
        </motion.article>

        {/* Code Examples */}
        {lesson.codeExamples && lesson.codeExamples.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Code Examples</h2>
            {lesson.codeExamples.map((example) => (
              <CodeBlock key={example.id} example={example} />
            ))}
          </motion.section>
        )}

        {/* YouTube Videos */}
        {lesson.youtubeVideos && lesson.youtubeVideos.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <YouTubePlayer videos={lesson.youtubeVideos} />
          </motion.section>
        )}

        {/* Notes */}
        {lesson.notes && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/30"
          >
            <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Takeaways
            </h3>
            {renderMarkdown(lesson.notes)}
          </motion.section>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="flex items-center justify-between">
            {lesson.previousLesson ? (
              <Link
                to={`/learn/${languageSlug}/${topicSlug}/${lesson.previousLesson.slug}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{lesson.previousLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {!completed && (
              <button
                onClick={handleMarkComplete}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Complete
              </button>
            )}

            {lesson.nextLesson ? (
              <Link
                to={`/learn/${languageSlug}/${topicSlug}/${lesson.nextLesson.slug}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>{lesson.nextLesson.title}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningLessonPage;
