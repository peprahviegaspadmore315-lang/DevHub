import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Topic } from '../../services/topicService';

interface TopicCardProps {
  topic: Topic;
  language: string;
  index: number;
}

const TopicCard = memo(({ topic, language, index }: TopicCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/topics/${language}/${topic.slug}`}
        className="block group"
      >
        <div className="p-6 rounded-xl border border-gray-700/50 bg-gray-800/50 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden">
          {/* Video Thumbnail Preview (on hover) */}
          {topic.video && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <img
                src={topic.video.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-3 relative z-10">
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
              {topic.title}
            </h3>
            {topic.video && (
              <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 relative z-10">
            {topic.description}
          </p>

          {/* Key Points Preview */}
          <div className="space-y-1 mb-4 relative z-10">
            {topic.keyPoints.slice(0, 2).map((point: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                <span className="text-indigo-400">•</span>
                <span className="line-clamp-1">{point}</span>
              </div>
            ))}
            {topic.keyPoints.length > 2 && (
              <span className="text-xs text-gray-500">
                +{topic.keyPoints.length - 2} more points
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50 relative z-10">
            <span className={`px-2 py-1 rounded text-xs capitalize ${
              topic.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
              topic.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {topic.difficulty}
            </span>
            <span className="text-indigo-400 text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Learn
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

TopicCard.displayName = 'TopicCard';

export default TopicCard;
