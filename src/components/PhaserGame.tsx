// src/components/PhaserGame.tsx
import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { MainScene } from "../game/scenes/MainScene";
import { WelcomeScene } from "../game/scenes/WelcomeScene";

export const PhaserGame = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (gameInstance.current || !gameContainer.current) {
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameContainer.current,
            width: "100%",
            height: "100%",
            backgroundColor: "#1a1a2e",
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: "100%",
                height: "100%",
            },
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { x: 0, y: 200 },
                    debug: false,
                },
            },
            scene: [
              MainScene, // Main game scene
              WelcomeScene, // Start with welcome scene
            ],
        };

        // Create a new Phaser game instance
        gameInstance.current = new Phaser.Game(config);

        // Listen for portfolio navigation event
        const handlePortfolioNavigation = () => {
            // This will be handled by the parent component
            console.log("Navigate to portfolio requested");
        };

        window.addEventListener(
            "navigateToPortfolio",
            handlePortfolioNavigation
        );

        // Cleanup function to destroy the game instance when the component unmounts
        return () => {
            window.removeEventListener(
                "navigateToPortfolio",
                handlePortfolioNavigation
            );
            gameInstance.current?.destroy(true);
            gameInstance.current = null;
        };
    }, []); // The empty dependency array ensures this runs only once on mount

    return (
        <div
            ref={gameContainer}
            id="phaser-game-container"
            className="w-full h-full"
        />
    );
};
