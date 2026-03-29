// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'premium';
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  subscriptionExpiry?: Date;
  createdAt: Date;
  dailySearches: number;
  lastSearchReset: Date;
}

// YouTube Channel Types
export interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  banner?: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  publishedAt: string;
  country?: string;
  customUrl?: string;
}

export interface ChannelAnalytics {
  channel: Channel;
  growthRate: number;
  engagementRate: number;
  uploadFrequency: number;
  estimatedRevenue: number;
  performanceScore: number;
  growthScore: number;
  seoScore: number;
  consistencyScore: number;
  historicalData: HistoricalDataPoint[];
  topVideos: Video[];
}

// YouTube Video Types
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: string[];
}

export interface VideoAnalytics {
  video: Video;
  performanceScore: number;
  viralScore: number;
  viewVelocity: number;
  engagementRate: number;
  clickThroughRate?: number;
  averageViewDuration?: number;
  keywordOpportunities: string[];
  relatedVideos: Video[];
  isOverperforming: boolean;
}

// Historical Data
export interface HistoricalDataPoint {
  date: string;
  views: number;
  subscribers: number;
  engagement: number;
}

// Trending Types
export interface TrendingVideo extends Video {
  viralScore: number;
  viewVelocity: number;
  category: string;
  region: string;
}

// SEO Types
export interface SEOAnalysis {
  title: string;
  description: string;
  tags: string[];
  score: number;
  suggestions: string[];
  keywordDensity: Record<string, number>;
}

// Transcript Types
export interface Transcript {
  videoId: string;
  segments: TranscriptSegment[];
  fullText: string;
  summary?: string;
  keyPoints?: string[];
  chapters?: Chapter[];
}

export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

export interface Chapter {
  title: string;
  startTime: number;
  endTime?: number;
}

// Thumbnail Types
export interface ThumbnailProject {
  id: string;
  name: string;
  thumbnails: Thumbnail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Thumbnail {
  id: string;
  url: string;
  size: { width: number; height: number };
  variants?: ThumbnailVariant[];
}

export interface ThumbnailVariant {
  id: string;
  url: string;
  size: { width: number; height: number };
  label: string;
}

// Revenue Types
export interface RevenueEstimate {
  videoId: string;
  estimatedRange: { min: number; max: number };
  rpm: number;
  cpm: number;
  currency: string;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'viral' | 'competitor' | 'upload' | 'keyword';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

// Report Types
export interface SavedReport {
  id: string;
  name: string;
  type: 'channel' | 'video' | 'trend';
  data: unknown;
  createdAt: Date;
}

// Plan Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    searchesPerDay: number;
    exportsPerMonth: number;
    savedProjects: number;
    alerts: number;
    historicalDays: number;
  };
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiresAuth?: boolean;
  planRequired?: 'free' | 'pro' | 'premium';
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
