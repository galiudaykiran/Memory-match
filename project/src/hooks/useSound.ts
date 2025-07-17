import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import useGameStore from '../store/gameStore';

type SoundType = 'flip' | 'match' | 'noMatch' | 'victory' | 'gameOver' | 'click' | 'start';

const useSoundEffects = () => {
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const musicEnabled = useGameStore(state => state.musicEnabled);
  const soundsRef = useRef<Record<SoundType, Howl | null>>({
    flip: null,
    match: null,
    noMatch: null,
    victory: null,
    gameOver: null,
    click: null,
    start: null,
  });
  const musicRef = useRef<Howl | null>(null);

  // Initialize sounds
  useEffect(() => {
    // Sound effects
    soundsRef.current = {
      flip: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3'],
        volume: 0.5,
      }),
      match: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'],
        volume: 0.5,
      }),
      noMatch: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2691/2691-preview.mp3'],
        volume: 0.5,
      }),
      victory: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/220/220-preview.mp3'],
        volume: 0.7,
      }),
      gameOver: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2878/2878-preview.mp3'],
        volume: 0.6,
      }),
      click: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2681/2681-preview.mp3'],
        volume: 0.4,
      }),
      start: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2010/2010-preview.mp3'],
        volume: 0.5,
      }),
    };

    // Background music
    musicRef.current = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3'],
      loop: true,
      volume: 0.3,
    });

    return () => {
      // Stop all sounds when unmounting
      Object.values(soundsRef.current).forEach(sound => sound?.stop());
      musicRef.current?.stop();
    };
  }, []);

  // Handle music playback based on musicEnabled state
  useEffect(() => {
    if (musicEnabled && musicRef.current) {
      musicRef.current.play();
    } else if (musicRef.current) {
      musicRef.current.pause();
    }
  }, [musicEnabled]);

  // Play a sound effect
  const playSound = (sound: SoundType) => {
    if (soundEnabled && soundsRef.current[sound]) {
      soundsRef.current[sound]?.play();
    }
  };

  return { playSound };
};

export default useSoundEffects;