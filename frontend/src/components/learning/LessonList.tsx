import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LessonSummary } from '../../services/learningService';

interface LessonListProps {
  lessons: LessonSummary[];
  languageSlug: string;
  topicSlug: string;
}

const LessonList = memo(({ lessons, languageSlug, topicSlug }: LessonListProps) => {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
        >
          <Link
            to={`/learn/${languageSlug}/${topicSlug}/${lesson.slug}`}
            className="block group"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
              {/* Lesson Number / Completion Status */}
              <div className="flex-shrink-0">
                {lesson.isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-400">
                    {lesson.orderIndex + 1}
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium group-hover:text-indigo-400 transition-colors truncate">
                  {lesson.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.durationMinutes} min
                  </span>
                  <span className="capitalize">{lesson.difficulty}</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
});

LessonList.displayName = 'LessonList';

export default LessonList;
