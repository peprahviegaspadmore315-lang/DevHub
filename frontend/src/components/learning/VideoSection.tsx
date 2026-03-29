import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import type { VideoInfo } from '../../services/topicService';

interface VideoSectionProps {
  video: VideoInfo | null;
  title?: string;
  topicTitle?: string;
}

const VideoSection = memo(({ video, title, topicTitle }: VideoSectionProps) => {
  const [showPlayer, setShowPlayer] = useState(false);

  if (!video) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoTitle = () => {
    if (title) return title;
    if (topicTitle) return `${topicTitle} - Video Tutorial`;
    return 'Video Tutorial';
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{getVideoTitle()}</h2>
          <p className="text-sm text-gray-400">Watch and learn</p>
        </div>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl">
        {!showPlayer ? (
          <>
            <img
              src={video.thumbnailUrl}
              alt={topicTitle || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group">
              <button
                onClick={() => setShowPlayer(true)}
                className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 shadow-lg"
                aria-label="Play video"
              >
                <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            {video.duration && (
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-sm font-medium">
                {formatDuration(video.duration)}
              </div>
            )}
          </>
        ) : (
          <iframe
            src={`${video.embedUrl}?autoplay=1`}
            title={getVideoTitle()}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Watch on YouTube
        </a>
        {video.duration && (
          <span>{formatDuration(video.duration)} min</span>
        )}
      </div>
    </motion.section>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;
