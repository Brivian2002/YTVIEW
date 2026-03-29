import axios from 'axios';
import type { Channel, Video, TrendingVideo } from '@/types';

// Note: In production, this should be stored in environment variables
const API_KEY = 'AIzaSyCbU9cVeuotNBYlw_EeDXzKHtBwTNWvco0';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const youtubeApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Search channels
export async function searchChannels(query: string, maxResults = 10): Promise<Channel[]> {
  try {
    const response = await youtubeApi.get('/search', {
      params: {
        q: query,
        type: 'channel',
        part: 'snippet',
        maxResults,
      },
    });

    const channelIds = response.data.items.map((item: { id: { channelId: string } }) => item.id.channelId).join(',');
    
    if (!channelIds) return [];

    const channelsResponse = await youtubeApi.get('/channels', {
      params: {
        id: channelIds,
        part: 'snippet,statistics,brandingSettings',
      },
    });

    return channelsResponse.data.items.map(mapChannelData);
  } catch (error) {
    console.error('Error searching channels:', error);
    return [];
  }
}

// Get channel by ID
export async function getChannel(channelId: string): Promise<Channel | null> {
  try {
    const response = await youtubeApi.get('/channels', {
      params: {
        id: channelId,
        part: 'snippet,statistics,brandingSettings',
      },
    });

    if (!response.data.items?.length) return null;
    return mapChannelData(response.data.items[0]);
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
}

// Get channel videos
export async function getChannelVideos(channelId: string, maxResults = 50): Promise<Video[]> {
  try {
    const searchResponse = await youtubeApi.get('/search', {
      params: {
        channelId,
        type: 'video',
        part: 'id',
        order: 'date',
        maxResults,
      },
    });

    const videoIds = searchResponse.data.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');
    
    if (!videoIds) return [];

    const videosResponse = await youtubeApi.get('/videos', {
      params: {
        id: videoIds,
        part: 'snippet,statistics,contentDetails',
      },
    });

    return videosResponse.data.items.map(mapVideoData);
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
}

// Get video by ID
export async function getVideo(videoId: string): Promise<Video | null> {
  try {
    const response = await youtubeApi.get('/videos', {
      params: {
        id: videoId,
        part: 'snippet,statistics,contentDetails',
      },
    });

    if (!response.data.items?.length) return null;
    return mapVideoData(response.data.items[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

// Get trending videos
export async function getTrendingVideos(regionCode = 'US', maxResults = 50): Promise<TrendingVideo[]> {
  try {
    const response = await youtubeApi.get('/videos', {
      params: {
        chart: 'mostPopular',
        regionCode,
        part: 'snippet,statistics,contentDetails',
        maxResults,
      },
    });

    return response.data.items.map((item: {
      id: string;
      snippet?: {
        title: string;
        description: string;
        thumbnails: { high?: { url: string }; medium?: { url: string } };
        channelId: string;
        channelTitle: string;
        publishedAt: string;
        tags?: string[];
        categoryId?: string;
      };
      statistics?: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
      };
      contentDetails?: {
        duration: string;
      };
    }) => ({
      ...mapVideoData(item),
      viralScore: calculateViralScore(item),
      viewVelocity: calculateViewVelocity(item),
      category: item.snippet?.categoryId || 'Unknown',
      region: regionCode,
    }));
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
}

// Search videos
export async function searchVideos(query: string, maxResults = 50): Promise<Video[]> {
  try {
    const searchResponse = await youtubeApi.get('/search', {
      params: {
        q: query,
        type: 'video',
        part: 'id',
        maxResults,
      },
    });

    const videoIds = searchResponse.data.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');
    
    if (!videoIds) return [];

    const videosResponse = await youtubeApi.get('/videos', {
      params: {
        id: videoIds,
        part: 'snippet,statistics,contentDetails',
      },
    });

    return videosResponse.data.items.map(mapVideoData);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

// Helper functions
function mapChannelData(item: {
  id: string;
  snippet?: {
    title: string;
    description: string;
    thumbnails: { high?: { url: string }; medium?: { url: string } };
    publishedAt: string;
    country?: string;
    customUrl?: string;
  };
  statistics?: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
  brandingSettings?: {
    image?: { bannerExternalUrl?: string };
  };
}): Channel {
  return {
    id: item.id,
    title: item.snippet?.title || '',
    description: item.snippet?.description || '',
    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
    banner: item.brandingSettings?.image?.bannerExternalUrl,
    subscriberCount: parseInt(item.statistics?.subscriberCount || '0'),
    viewCount: parseInt(item.statistics?.viewCount || '0'),
    videoCount: parseInt(item.statistics?.videoCount || '0'),
    publishedAt: item.snippet?.publishedAt || '',
    country: item.snippet?.country,
    customUrl: item.snippet?.customUrl,
  };
}

function mapVideoData(item: {
  id: string | { videoId?: string };
  snippet?: {
    title: string;
    description: string;
    thumbnails: { high?: { url: string }; medium?: { url: string } };
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    tags?: string[];
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}): Video {
  return {
    id: typeof item.id === 'string' ? item.id : item.id?.videoId || '',
    title: item.snippet?.title || '',
    description: item.snippet?.description || '',
    thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
    channelId: item.snippet?.channelId || '',
    channelTitle: item.snippet?.channelTitle || '',
    publishedAt: item.snippet?.publishedAt || '',
    duration: item.contentDetails?.duration || 'PT0S',
    viewCount: parseInt(item.statistics?.viewCount || '0'),
    likeCount: parseInt(item.statistics?.likeCount || '0'),
    commentCount: parseInt(item.statistics?.commentCount || '0'),
    tags: item.snippet?.tags || [],
  };
}

function calculateViralScore(item: {
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  snippet?: {
    publishedAt: string;
  };
}): number {
  const views = parseInt(item.statistics?.viewCount || '0');
  const likes = parseInt(item.statistics?.likeCount || '0');
  const comments = parseInt(item.statistics?.commentCount || '0');
  const publishedAt = new Date(item.snippet?.publishedAt || '');
  const hoursSince = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince === 0) return 0;
  
  const viewVelocity = views / hoursSince;
  const engagementRate = (likes + comments) / views;
  
  // Normalize to 0-100 scale
  const score = Math.min(100, (viewVelocity / 1000) * 10 + engagementRate * 100);
  return Math.round(score);
}

function calculateViewVelocity(item: {
  statistics?: {
    viewCount: string;
  };
  snippet?: {
    publishedAt: string;
  };
}): number {
  const views = parseInt(item.statistics?.viewCount || '0');
  const publishedAt = new Date(item.snippet?.publishedAt || '');
  const hoursSince = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince === 0) return 0;
  return Math.round(views / hoursSince);
}

export default youtubeApi;
