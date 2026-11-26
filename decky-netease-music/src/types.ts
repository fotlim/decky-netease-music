export interface Track {
  id: number;
  name: string;
  artist: string;
  album?: string;
  albumId?: number;
  cover: string;
  duration: number; // 毫秒
  fee?: number;
}

export interface Playlist {
  id: number;
  name: string;
  cover: string;
  description?: string;
  trackCount: number;
  playCount: number;
  creator?: string;
  updateTime?: number;
  tracks?: Track[];
}

export interface Album {
  id: number;
  name: string;
  cover: string;
  artist: string;
  publishTime: number;
  size: number;
  description?: string;
}

export interface Artist {
  id: number;
  name: string;
  cover: string;
  alias?: string[];
  briefDesc?: string;
  musicSize?: number;
  albumSize?: number;
}

export interface Toplist {
  id: number;
  name: string;
  cover: string;
  updateFrequency?: string;
  trackCount: number;
}

export interface Profile {
  userId: number;
  nickname: string;
  avatarUrl: string;
  vipType?: number;
}

export interface AuthStatus {
  loggedIn: boolean;
  profile: Profile | null;
}

export interface SearchResult {
  type: number;
  keyword: string;
  count: number;
  songs?: Track[];
  albums?: Album[];
  artists?: Artist[];
  playlists?: Playlist[];
}

export interface SongUrl {
  id: number;
  url: string;
  br: number;
  fee: number;
  code: number;
  type: string;
}

export interface PlayResult {
  track: Track;
  url: SongUrl;
}

export interface LyricResult {
  lrc: string;
  tlyric: string;
  yrc?: string;
}

export interface SuggestItem {
  type: string;
  id: number;
  text: string;
  sub?: string;
}
