"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HeroBackgroundVideoProps = {
  className: string;
  poster: string;
  primarySrc: string;
  fallbackSrc: string;
  opacity?: number;
  playbackRate?: number;
};

export function HeroBackgroundVideo({
  className,
  poster,
  primarySrc,
  fallbackSrc,
  opacity,
  playbackRate,
}: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sources = useMemo(
    () => [primarySrc, fallbackSrc].filter((src, index, arr) => Boolean(src) && arr.indexOf(src) === index),
    [primarySrc, fallbackSrc],
  );
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [primarySrc, fallbackSrc]);

  function ensurePlayback() {
    const node = videoRef.current;

    if (!node) {
      return;
    }

    const playPromise = node.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => undefined);
    }
  }

  const activeSource = sources[sourceIndex] ?? "";

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      src={activeSource}
      poster={poster}
      style={opacity === undefined ? undefined : { opacity }}
      onCanPlay={ensurePlayback}
      onLoadedData={(event) => {
        if (playbackRate && playbackRate > 0) {
          event.currentTarget.playbackRate = playbackRate;
        }

        ensurePlayback();
      }}
      onError={() => {
        setSourceIndex((current) => {
          if (current >= sources.length - 1) {
            return current;
          }

          return current + 1;
        });
      }}
    />
  );
}
