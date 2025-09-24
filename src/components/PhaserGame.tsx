// src/components/PhaserGame.tsx
import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { MainScene } from '../game/scenes/MainScene';

export const PhaserGame = () => {
  // Use a ref to target the div where the game will be rendered
  const gameContainer = useRef<HTMLDivElement>(null);
  // Use a ref to hold the game instance
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Ensure we only initialize the game once
    if (gameInstance.current || !gameContainer.current) {
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // Automatically choose WebGL or Canvas
      parent: gameContainer.current, // The div to render the game in
      width: 800,
      height: 600,
      backgroundColor: '#2d2d2d',
      scene: [
        MainScene, // Add our scene to the game
        // Add other scenes here
      ],
    };

    // Create a new Phaser game instance
    gameInstance.current = new Phaser.Game(config);

    // Cleanup function to destroy the game instance when the component unmounts
    return () => {
      gameInstance.current?.destroy(true);
      gameInstance.current = null;
    };
  }, []); // The empty dependency array ensures this runs only once on mount

  return <div ref={gameContainer} id="phaser-game-container" />;
};