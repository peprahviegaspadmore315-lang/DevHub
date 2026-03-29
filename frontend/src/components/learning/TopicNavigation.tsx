import { memo, useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { topicApi, Topic } from '../../services/topicService';

interface TopicNavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LANGUAGES = [
  { id: 'html', name: 'HTML', color: '#e34f26', icon: '</>' },
  { id: 'css', name: 'CSS', color: '#1572b6', icon: '{}' },
  { id: 'java', name: 'Java', color: '#b07219', icon: 'Ja' },
  { id: 'python', name: 'Python', color: '#3776ab', icon: 'Py' },
];

const TopicNavigation = memo(({ isOpen = true, onClose }: TopicNavigationProps) => {
  const location = useLocation();
  const [expandedLanguages, setExpandedLanguages] = useState<string[]>(['html']);
  const [topics, setTopics] = useState<Record<string, Topic[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const allTopics: Record<string, Topic[]> = {};
        for (const lang of LANGUAGES) {
          const data = await topicApi.getTopics(lang.id);
          allTopics[lang.id] = data;
        }
        setTopics(allTopics);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const toggleLanguage = (langId: string) => {
    setExpandedLanguages((prev) =>
      prev.includes(langId)
        ? prev.filter((id) => id !== langId)
        : [...prev, langId]
    );
  };

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results: Record<string, Topic[]> = {};
    
    for (const lang of LANGUAGES) {
      const matches = topics[lang.id]?.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query)
      );
      if (matches?.length) {
        results[lang.id] = matches;
      }
    }
    return results;
  }, [searchQuery, topics]);

  const currentLanguage = useMemo(() => {
    const match = location.pathname.match(/\/topics\/([^/]+)/);
    if (!match) return null;
    return match[1] === 'javascript' ? 'java' : match[1];
  }, [location.pathname]);

  const currentSlug = useMemo(() => {
    const match = location.pathname.match(/\/topics\/[^/]+\/([^/]+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-gray-900 border-r border-gray-800 z-50 overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Topics</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
            </div>
          ) : filteredTopics ? (
            // Search Results
            Object.entries(filteredTopics).map(([langId, langTopics]) => {
              const lang = LANGUAGES.find((l) => l.id === langId);
              if (!lang) return null;
              return (
                <div key={langId} className="mb-6">
                  <div
                    className="flex items-center gap-2 mb-2 text-sm font-semibold"
                    style={{ color: lang.color }}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {langTopics.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          to={`/topics/${langId}/${topic.slug}`}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentLanguage === langId && currentSlug === topic.slug
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          ) : (
            // Normal Topic List
            LANGUAGES.map((lang) => {
              const langTopics = topics[lang.id] || [];
              const isExpanded = expandedLanguages.includes(lang.id);

              return (
                <div key={lang.id} className="mb-4">
                  {/* Language Header */}
                  <button
                    onClick={() => toggleLanguage(lang.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      currentLanguage === lang.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: `${lang.color}20`, color: lang.color }}
                      >
                        {lang.icon}
                      </span>
                      <span className="font-medium text-white">{lang.name}</span>
                      <span className="text-xs text-gray-500">({langTopics.length})</span>
                    </div>
                    <motion.svg
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </button>

                  {/* Topics */}
                  <AnimatePresence>
                    {isExpanded && langTopics.length > 0 && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <li className="pl-4 pt-2 space-y-1">
                          {langTopics.map((topic) => (
                            <Link
                              key={topic.id}
                              to={`/topics/${lang.id}/${topic.slug}`}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                currentLanguage === lang.id && currentSlug === topic.slug
                                  ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{topic.title}</span>
                                {topic.video && (
                                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                  </svg>
                                )}
                              </div>
                            </Link>
                          ))}
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}

          {filteredTopics && Object.keys(filteredTopics).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No topics found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
});

TopicNavigation.displayName = 'TopicNavigation';

export default TopicNavigation;
