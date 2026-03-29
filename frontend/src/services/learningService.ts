import api from './api';

export interface Language {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  color: string;
  difficultyLevel: string;
  topicCount: number;
  lessonCount: number;
  isActive: boolean;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  orderIndex: number;
  isPremium: boolean;
  languageId: number;
  languageName: string;
  languageSlug: string;
  lessonCount: number;
  lessons?: LessonSummary[];
}

export interface LessonSummary {
  id: number;
  title: string;
  slug: string;
  orderIndex: number;
  durationMinutes: number;
  difficulty: string;
  isPremium: boolean;
  isCompleted?: boolean;
  progressPercent?: number;
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  content: string;
  notes: string;
  orderIndex: number;
  durationMinutes: number;
  difficulty: string;
  isPremium: boolean;
  isCompleted?: boolean;
  progressPercent?: number;
  topicId: number;
  topicName: string;
  topicSlug: string;
  languageId: number;
  languageName: string;
  languageSlug: string;
  codeExamples: CodeExample[];
  youtubeVideos: YouTubeVideo[];
  previousLesson?: LessonSummary;
  nextLesson?: LessonSummary;
}

export interface CodeExample {
  id: number;
  title: string;
  description: string;
  code: string;
  language: string;
  codeType: string;
  output: string;
  orderIndex: number;
}

export interface YouTubeVideo {
  id: number;
  title: string;
  description: string;
  youtubeVideoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  orderIndex: number;
}

export interface UserProgress {
  lessonId: number;
  completed: boolean;
  progressPercent: number;
  completedAt?: string;
}

export interface ProgressUpdateRequest {
  lessonId: number;
  progressPercent?: number;
  completed?: boolean;
}

export const learningApi = {
  // Languages
  getLanguages: async (): Promise<Language[]> => {
    const response = await api.get<Language[]>('/learning/languages');
    return response.data;
  },

  getLanguage: async (slug: string): Promise<Language> => {
    const response = await api.get<Language>(`/learning/languages/${slug}`);
    return response.data;
  },

  // Topics
  getTopics: async (languageSlug: string): Promise<Topic[]> => {
    const response = await api.get<Topic[]>(`/learning/languages/${languageSlug}/topics`);
    return response.data;
  },

  getTopic: async (languageSlug: string, topicSlug: string): Promise<Topic> => {
    const response = await api.get<Topic>(
      `/learning/languages/${languageSlug}/topics/${topicSlug}`
    );
    return response.data;
  },

  // Lessons
  getLessons: async (languageSlug: string, topicSlug: string): Promise<LessonSummary[]> => {
    const response = await api.get<LessonSummary[]>(
      `/learning/languages/${languageSlug}/topics/${topicSlug}/lessons`
    );
    return response.data;
  },

  getLesson: async (
    languageSlug: string,
    topicSlug: string,
    lessonSlug: string
  ): Promise<Lesson> => {
    const response = await api.get<Lesson>(
      `/learning/languages/${languageSlug}/topics/${topicSlug}/lessons/${lessonSlug}`
    );
    return response.data;
  },

  // Progress
  updateProgress: async (request: ProgressUpdateRequest): Promise<UserProgress> => {
    const response = await api.post<UserProgress>('/learning/progress', request);
    return response.data;
  },

  getUserProgress: async (): Promise<UserProgress[]> => {
    const response = await api.get<UserProgress[]>('/learning/progress');
    return response.data;
  },

  getProgressByLanguage: async (languageId: number): Promise<UserProgress[]> => {
    const response = await api.get<UserProgress[]>(`/learning/progress/languages/${languageId}`);
    return response.data;
  },
};
