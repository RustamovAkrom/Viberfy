"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrackBySlug, likeTrack, PlayTrack, getSimilarTracks } from "@/lib/tracks";
import { TrackType } from "@/types/tracksTypes";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Headphones, Heart, Share2, Download, ChevronDown } from "lucide-react";
import { TrackCard } from "@/components/TrackCard";
import { TrackShare } from "@/components/TrackShare";
import Link from "next/link";
import React from "react";
import Image from "next/image";


export default function TrackDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [track, setTrack] = useState<TrackType | null>(null);
  const [similar, setSimilar] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showDescription, setShowDescription] = useState(false)
  const { setQueue, currentTrack, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTrackBySlug(slug);
        setTrack(data);
        setIsLiked(data?.is_liked ?? false);

        const recs = await getSimilarTracks(slug);
        setSimilar(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <p className="text-center mt-10 text-gray-700 dark:text-gray-300 animate-pulse">Загрузка трека...</p>;
  if (!track) return <p className="text-center mt-10 text-red-500">Трек не найден</p>;

  const handlePlay = async () => {
    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
    setQueue([track]);
    togglePlay(track);

    if (!isCurrentlyPlaying) {
      try {
        const updated = await PlayTrack(track.slug);
        setTrack(prev => prev ? { ...prev, plays_count: updated.plays_count } : prev);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLike = async () => {
    try {
      const updated = await likeTrack(track.slug);
      setIsLiked(updated.is_liked);
      setTrack(prev => prev ? { ...prev, likes_count: updated.likes_count } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-12 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">

      {/* Основной блок: cover + info */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">

        {/* Cover */}
        <Image
          src={track.cover}
          alt={track.name}
          width={400}
          height={400}
          priority
          className="w-full md:w-80 h-80 md:h-80 object-cover rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700"
        />

        {/* Info + Buttons */}
        <div className="flex flex-col flex-1 gap-4 py-5">

          {/* Название */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">{track.name}</h1>

          {/* Artist / Featured / Album / Duration / Language / Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-700 dark:text-gray-300">
            <div className="flex flex-col gap-1">
              <span>Artist: <Link href={`/artists/${track.artist.slug}`} className="font-semibold hover:underline">{track.artist.name}</Link></span>
              {track.featured_artists && track.featured_artists.length > 0 && (
                <span>Featuring: {track.featured_artists.map(fa => (
                  fa.name
                ))}</span>
              )}
              <span>Album: {track.album ? <Link href={`/albums/${track.album.slug}`} className="font-medium hover:underline">{track.album.name}</Link> : "Single"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span>Duration: <span className="font-medium">{formatDuration(track.duration)}</span></span>
              {track.language && <span>Language: <span className="font-medium">{track.language}</span></span>}
              {track.mood && <span>Mood: <span className="font-medium">{track.mood}</span></span>}
            </div>
          </div>

          {/* Genres */}
          <div className="flex items-center gap-4 mt-2">
            {track.genres && track.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {track.genres.map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-semibold">{g.name}</span>
                ))}
              </div>
            )}
          </div>

          {/* 🎵 Controls: Play / Like / Download / Share */}
          <div className="flex flex-wrap items-center gap-3 mt-3">

            {/* ▶️ Play Button */}
            <button
              onClick={handlePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all
      ${currentTrack?.id === track.id && isPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white scale-105"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 animate-pulse" /> Playing
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play
                </>
              )}
            </button>

            {/* ❤️ Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all
              ${isLiked ? "bg-pink-500 hover:bg-pink-600 text-white scale-105"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
                }`}
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-300 ${isLiked ? "fill-current text-white" : "text-gray-500"
                  }`}
              />
              <span>{track.likes_count}</span>
              <span className="hidden sm:inline">Like</span>
            </button>

            {/* ⬇️ Download Button */}
            <a
              href={track.audio}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{track.download_count}</span>
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* 🔗 Share */}
            <div className="">
              <TrackShare track={track} />
            </div>
          </div>


          <div className="flex items-center gap-4 mt-2">
            {track.youtube_url && (
              <a href={track.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-medium hover:underline">
                <Play className="w-5 h-5" /> Watch on YouTube
              </a>
            )}
          </div>

        </div>
      </div>

      {/* 📜 Description & Lyrics */}
      <div className="w-full max-w-4xl space-y-4">
        {track.description && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
            <button
              onClick={() => {
                setShowDescription((prev) => !prev);
                if (!showDescription) setShowLyrics(false);
              }}
              className="w-full flex justify-between items-center px-5 py-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <span>Description</span>
              <ChevronDown
                className={`w-5 h-5 transform transition-transform duration-300 ${showDescription ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Контент description */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${showDescription ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 py-4 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 whitespace-pre-line">
                  {track.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {track.lyrics && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
            <button
              onClick={() => {
                setShowLyrics((prev) => !prev);
                if (!showLyrics) setShowDescription(false);
              }}
              className="w-full flex justify-between items-center px-5 py-3 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <span>Lyrics</span>
              <ChevronDown
                className={`w-5 h-5 transform transition-transform duration-300 ${showLyrics ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Контент lyrics */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${showLyrics ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 py-4 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700 whitespace-pre-line">
                  {track.lyrics}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Похожие треки */}
      {similar.length > 0 && (
        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100 text-center">Related tracks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similar.map(t => (
              <TrackCard key={t.slug} track={t} allTracks={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
