import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { topicApi } from '../services/topicService';
import TopicCard from '../components/learning/TopicCard';
import type { Topic } from '../services/topicService';

const LANGUAGE_INFO: Record<string, { name: string; color: string; description: string }> = {
  html: {
    name: 'HTML',
    color: '#e34f26',
    description: 'The foundation of every webpage. Learn how to structure content with HTML.',
  },
  css: {
    name: 'CSS',
    color: '#1572b6',
    description: 'Make websites beautiful! Learn how to style and layout your pages.',
  },
  java: {
    name: 'Java',
    color: '#b07219',
    description: 'Build strong programming foundations with Java syntax, OOP, files, and core collections.',
  },
  javascript: {
    name: 'Java',
    color: '#b07219',
    description: 'Build strong programming foundations with Java syntax, OOP, files, and core collections.',
  },
  python: {
    name: 'Python',
    color: '#3776ab',
    description: 'A powerful yet easy-to-learn language. Great for beginners and pros.',
  },
};

const TopicsHome = () => {
  const { language } = useParams<{ language: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const info = LANGUAGE_INFO[language || ''] || {
    name: language?.toUpperCase() || 'Topics',
    color: '#6366f1',
    description: 'Learn programming concepts step by step.',
  };

  useEffect(() => {
    const fetchTopics = async () => {
      if (!language) return;
      try {
        setLoading(true);
        const data = await topicApi.getTopics(language);
        setTopics(data);
      } catch (err) {
        setError('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/topics" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Link to="/topics" className="text-gray-400 hover:text-white text-sm">
            ← All Topics
          </Link>
        </motion.nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ backgroundColor: `${info.color}20` }}
          >
            <span className="text-4xl font-bold" style={{ color: info.color }}>
              {info.name.charAt(0)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{info.name} Topics</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{info.description}</p>
        </motion.header>

        {/* Topics Grid */}
        {topics.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                language={language || ''}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No topics available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsHome;
