import type { AlbumType } from "./albumsTypes";
import type { TrackType } from "./tracksTypes";

export type ArtistsType = {
  id: number;
  name: string;
  slug: string;
  avatar: string | null;
  albums_count: number;
  tracks_count: number;
  created_at: string;
  updated_at: string;
};

export type ArtistType = {
  id: number;
  name: string;
  slug: string;
  owner: number;
  bio: string | null;
  avatar: string | null;
  meta: string | null;

  folowers_count?: number;
  total_plays?: number;
  total_likes?: number;

  is_verified?: boolean;

  albums: AlbumType[];
  tracks: TrackType[];

  albums_count: number;
  tracks_count: number;

  created_at: string;
  updated_at: string;
};