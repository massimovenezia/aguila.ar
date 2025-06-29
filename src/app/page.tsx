"use client";

import { useRef, useState, useEffect } from "react";

function CustomAudioPlayer({ src, label }: { src: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // Toggle play / pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Volume change from slider
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
    setMuted(vol === 0);
  };

  // Click icon to mute/unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.volume = volume || 1;
      setMuted(false);
    } else {
      audio.volume = 0;
      setMuted(true);
    }
  };

  const formatTime = (t: number) => {
    if (isNaN(t)) return "--:--";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md p-4 rounded-lg hover:bg-zinc-700/80 transition">
      <p className="text-lg font-medium mb-4 text-center">{label}</p>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-2 text-sm text-zinc-300">
        {/* Play / Pause */}
        <button onClick={togglePlay} className="p-1 hover:opacity-80 text-white">
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <polygon points="5,4 19,12 5,20" />
            </svg>
          )}
        </button>

        {/* Time elapsed */}
        <span className="w-12 text-right tabular-nums">{formatTime(progress)}</span>

        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max={duration || 1}
          value={progress}
          onChange={(e) => {
            const t = parseFloat(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = t;
            setProgress(t);
          }}
          className="flex-grow accent-zinc-500"
        />

        {/* Time remaining */}
        <span className="w-12 tabular-nums">{formatTime(duration - progress)}</span>

        {/* Volume */}
        <div className="relative group text-white">
          <button onClick={toggleMute} className="p-1 hover:opacity-80">
            {muted || volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <line x1="16" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <path d="M16.5 12c0-1.77-.77-3.29-2-4.24v8.48c1.23-.95 2-2.47 2-4.24z" />
              </svg>
            )}
          </button>
          {/* Vertical slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="absolute bottom-full mb-7 left-1/2 -translate-x-1/2 w-13 h-1 -rotate-90 origin-bottom accent-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/background.mp4"
      />

      <section className="relative z-10 max-w-4xl mx-auto p-6 transform scale-90 origin-top">
        {/* Header */}
        <header className="text-center pt-16 pb-6">
          <h1 className="text-5xl font-bold tracking-tight mb-4">AGUILA</h1>
          <p className="text-zinc-300 text-lg">Music Producer / Beat Maker</p>
        </header>

        {/* Socials */}
        <section className="flex justify-center gap-6 mb-12">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
            <img src="/icons/instagram.svg" alt="Instagram" className="w-6 h-6" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
            <img src="/icons/youtube.svg" alt="YouTube" className="w-6 h-6" />
          </a>
          <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
            <img src="/icons/spotify.svg" alt="Spotify" className="w-6 h-6" />
          </a>
          <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
            <img src="/icons/apple-music.svg" alt="Apple Music" className="w-6 h-6" />
          </a>
        </section>

        {/* Beats list (no section title) */}
        <section className="mb-16">
          <ul className="space-y-4">
            <li>
              <CustomAudioPlayer src="/beats/midnight-ride.mp3" label="Midnight Ride" />
            </li>
            <li>
              <CustomAudioPlayer src="/beats/shadow-realm.mp3" label="Shadow Realm" />
            </li>
            <li>
              <CustomAudioPlayer src="/beats/neon-dreams.mp3" label="Neon Dreams" />
            </li>
            <li>
              <CustomAudioPlayer src="/beats/echoes.mp3" label="Echoes" />
            </li>
            <li>
              <CustomAudioPlayer src="/beats/nightfall.mp3" label="Nightfall" />
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center text-zinc-400 text-sm pb-8">
          <a className="hover:underline" href="mailto:work@aguila.ar">work@aguila.ar</a>
        </footer>
      </section>
    </main>
  );
}
