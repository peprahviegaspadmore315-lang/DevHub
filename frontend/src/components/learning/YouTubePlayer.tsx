import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { YouTubeVideo } from '../../services/learningService';

interface YouTubePlayerProps {
  videos: YouTubeVideo[];
}

const YouTubePlayer = memo(({ videos }: YouTubePlayerProps) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(
    videos.length > 0 ? videos[0] : null
  );

  if (videos.length === 0) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Video Lessons
      </h3>

      {videos.length === 1 ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
          <iframe
            src={`${selectedVideo?.embedUrl}?autoplay=0`}
            title={selectedVideo?.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <>
          {/* Video Selection Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedVideo?.id === video.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {video.title}
              </button>
            ))}
          </div>

          {/* Video Player */}
          <AnimatePresence mode="wait">
            {selectedVideo && (
              <motion.div
                key={selectedVideo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-gray-900"
              >
                <iframe
                  src={`${selectedVideo.embedUrl}?autoplay=0`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`relative group rounded-lg overflow-hidden transition-all ${
                  selectedVideo?.id === video.id ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {video.durationSeconds && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-xs text-white">
                    {formatDuration(video.durationSeconds)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
