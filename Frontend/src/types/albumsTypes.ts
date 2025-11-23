import { TrackType } from "./tracksTypes";
import { ArtistType } from "./artistsTypes";

export type AlbumsType = {
  id: number;
  name: string;
  slug: string;
  cover: string | null;
  tracks_count: number;
  created_at: string;
};

export type AlbumType = {
  id: number;
  name: string;
  slug: string;
  owner: number;
  release_date: string | null;
  cover: string | null;
  
  description?: string;
  is_published: boolean;
  
  artist: ArtistType;
  tracks: TrackType[];

  tracks_count: number;
  plays_count: number;
  likes_count: number;
  listens_last_week: number;
  listens_last_month: number;
  
  created_at: string;
  updated_at: string;
}