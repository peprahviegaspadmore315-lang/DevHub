import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { topicApi } from '../services/topicService';
import type { Topic } from '../services/topicService';
import VideoSection from '../components/learning/VideoSection';
import AIExplanation from '../components/learning/AIExplanation';
import { ReadControls } from '../components/robot/components/ReadControls';
import { ExplainCodeButton } from '../components/robot/components/ExplainCodeButton';
import { SmartQuizLauncher } from '../components/robot/components/SmartQuizLauncher';
import { OrbitalLoader } from '../components/ui/orbital-loader';
import { useAIAssistant } from '../contexts/AIAssistantContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LANGUAGE_COLORS: Record<string, string> = {
  html: '#e34f26',
  css: '#1572b6',
  java: '#b07219',
  javascript: '#b07219',
  python: '#3776ab',
};

const LANGUAGE_DISPLAY: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  java: 'Java',
  javascript: 'Java',
  python: 'Python',
};

const TopicPageComponent = () => {
  const { language, slug } = useParams<{ language: string; slug: string }>();
  const { setLearningContext, clearLearningContext } = useAIAssistant();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      if (!language || !slug) return;
      try {
        setLoading(true);
        const data = await topicApi.getTopic(language, slug);
        setTopic(data);
      } catch {
        setError('Failed to load topic');
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [language, slug]);

  useEffect(() => {
    const saved = localStorage.getItem('topicpage-theme');
    if (saved) setIsDark(saved === 'dark');
  }, []);

  useEffect(() => {
    if (!topic) {
      clearLearningContext();
      return;
    }

    setLearningContext({
      source: 'topic-page',
      route: window.location.pathname + window.location.search,
      language: language || undefined,
      topicSlug: slug || undefined,
      topicTitle: topic.title,
      topicSummary: topic.simpleExplanation || topic.description || '',
      lessonContent: topic.description || topic.simpleExplanation || '',
      codeExample: topic.codeExamples?.[0]?.code || '',
    });

    return () => {
      clearLearningContext();
    };
  }, [clearLearningContext, language, setLearningContext, slug, topic]);

  const handleCopy = useCallback(async (code: string, id: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <OrbitalLoader
          message="Loading topic details, code examples, and AI learning support..."
          size="lg"
          tone="light"
        />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Topic not found'}</p>
          <Link to="/topics" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Go to Topics
          </Link>
        </div>
      </div>
    );
  }

  const color = LANGUAGE_COLORS[language || ''] || '#6366f1';
  const syntaxTheme = isDark ? vscDarkPlus : vs;
  const topicContent = topic.contentMarkdown || topic.simpleExplanation || topic.description || '';
  const readingText = topic.simpleExplanation || topic.description || '';
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h3 className="mb-4 mt-6 text-2xl font-bold text-white first:mt-0">{children}</h3>
    ),
    h2: ({ children }: any) => (
      <h4 className="mb-3 mt-6 text-xl font-semibold text-white">{children}</h4>
    ),
    h3: ({ children }: any) => (
      <h5 className="mb-3 mt-5 text-lg font-semibold text-white">{children}</h5>
    ),
    p: ({ children }: any) => (
      <p className="mb-4 leading-relaxed text-gray-300">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-300">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-300">{children}</ol>
    ),
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');

      if (!inline) {
        return (
          <div className="mb-4 overflow-hidden rounded-xl border border-gray-700">
            <SyntaxHighlighter
              style={syntaxTheme}
              language={match?.[1] || language || 'text'}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: isDark ? '#111827' : '#f8fafc',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className="rounded bg-gray-900 px-1.5 py-0.5 font-mono text-sm text-sky-300"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Title Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {LANGUAGE_DISPLAY[language || '']}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
              {topic.difficulty}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {topic.title}
          </h1>
          <p className="text-lg text-gray-400">
            {topic.description}
          </p>
        </motion.section>

        {/* Video Section */}
        {topic.video && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <VideoSection video={topic.video} topicTitle={topic.title} />
          </motion.section>
        )}

        {/* Explanation Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">What is it?</h2>
            <ReadControls
              text={readingText}
              compact
              className="bg-gray-800/50 rounded-lg px-3 py-2"
            />
          </div>
          <div className="rounded-xl p-6 bg-gray-800/50 border border-gray-700">
            <ReactMarkdown components={markdownComponents}>
              {topicContent}
            </ReactMarkdown>
          </div>

          <div className="mt-6 rounded-xl p-6 bg-indigo-500/10 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-indigo-400">Why Learn it?</h3>
              <ReadControls
                text={topic.whyLearn}
                compact
              />
            </div>
            <p className="text-gray-300">{topic.whyLearn}</p>
          </div>

          <AIExplanation
            topicTitle={topic.title}
            topicContent={readingText}
            language={language || 'unknown'}
          />
        </motion.section>

        {/* Code Examples Section */}
        {topic.codeExamples && topic.codeExamples.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Examples</h2>
            <div className="space-y-6">
              {topic.codeExamples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
                    <div>
                      <span className="font-medium text-white">{example.title}</span>
                      {example.description && (
                        <span className="text-sm ml-2 text-gray-400">— {example.description}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(example.code, example.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        copiedId === example.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {copiedId === example.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="relative">
                    <SyntaxHighlighter
                      language={example.codeLanguage || 'text'}
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        background: '#1e1e1e',
                      }}
                      showLineNumbers={example.code.split('\n').length > 3}
                      lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        color: '#4a4a4a',
                        userSelect: 'none',
                      }}
                    >
                      {example.code}
                    </SyntaxHighlighter>
                  </div>

                  {example.output && (
                    <div className="px-4 py-3 bg-gray-900 border-t border-gray-800">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Output</span>
                      <pre className="font-mono text-sm text-green-400 mt-1">{example.output}</pre>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Key Points Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Key Points</h2>
            <ReadControls
              text={topic.keyPoints.join('. ')}
              compact
            />
          </div>
          <div className="grid gap-3">
            {topic.keyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {index + 1}
                </span>
                <p className="text-gray-300">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Code Explanation Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Try It Yourself</h2>
          <div className="rounded-xl p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/30">
            <p className="text-gray-300 mb-4">
              Select any code from above and I'll explain it line by line! You can also paste your own code below.
            </p>
            <div className="mb-4">
              <textarea
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                placeholder="Paste your code here for AI explanation..."
                className="w-full h-32 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 font-mono text-sm resize-none focus:outline-none focus:border-purple-500"
              />
            </div>
            <ExplainCodeButton
              code={selectedCode}
              language={language}
            />
          </div>
        </motion.section>

        {/* Quiz Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-[1.9rem] border border-orange-300/25 bg-[linear-gradient(135deg,rgba(255,247,237,0.12)_0%,rgba(255,237,213,0.08)_48%,rgba(251,146,60,0.12)_100%)] p-6 shadow-[0_28px_48px_-36px_rgba(251,146,60,0.45)]">
            <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-orange-400/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative mb-5">
              <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
                <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-3 py-1.5">
                  Quiz checkpoint
                </span>
                <span className="rounded-full border border-orange-300/25 bg-white/5 px-3 py-1.5 text-orange-100/80">
                  Onboarding-inspired flow
                </span>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-white mb-2">Test your knowledge with a guided AI quiz</h2>
                  <p className="text-orange-50/70 leading-7">
                    Instead of a plain question list, DevHub AI now opens a softer step-by-step quiz flow
                    inspired by your reference. It uses this lesson to generate a cleaner, more focused check-in.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-orange-50/80">
                  <span className="rounded-full border border-orange-300/20 bg-white/5 px-3 py-1.5">
                    Adaptive topic context
                  </span>
                  <span className="rounded-full border border-orange-300/20 bg-white/5 px-3 py-1.5">
                    5-question flow
                  </span>
                  <span className="rounded-full border border-orange-300/20 bg-white/5 px-3 py-1.5">
                    Instant score and review
                  </span>
                </div>
              </div>
            </div>

            <SmartQuizLauncher
              topic={topic.title}
              content={topic.simpleExplanation}
              language={language}
              className="w-full"
            />
          </div>
        </motion.section>

        {/* Navigation Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-6 border-t border-gray-800"
        >
          <Link
            to={`/topics/${language}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {LANGUAGE_DISPLAY[language || '']} Topics
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const TopicPage = memo(TopicPageComponent);
export default TopicPage;
