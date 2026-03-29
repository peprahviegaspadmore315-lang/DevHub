import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Language } from '../../services/learningService';

interface LanguageCardProps {
  language: Language;
  index: number;
}

const LanguageCard = memo(({ language, index }: LanguageCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        to={`/learn/${language.slug}`}
        className="block group"
      >
        <div
          className="relative p-6 rounded-xl border border-gray-700/50 bg-gray-800/50 
                     hover:bg-gray-800/80 hover:border-indigo-500/50
                     transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
        >
          {/* Language Icon */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-3xl font-bold"
            style={{ backgroundColor: `${language.color}20`, color: language.color }}
          >
            {language.name.charAt(0)}
          </div>

          {/* Language Name */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            {language.name}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {language.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {language.topicCount} Topics
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {language.lessonCount} Lessons
            </span>
          </div>

          {/* Difficulty Badge */}
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium capitalize"
            style={{
              backgroundColor: `${language.color}20`,
              color: language.color,
            }}
          >
            {language.difficultyLevel}
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

LanguageCard.displayName = 'LanguageCard';

export default LanguageCard;
