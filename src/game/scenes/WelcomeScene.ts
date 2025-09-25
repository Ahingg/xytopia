import Phaser from "phaser";

export class WelcomeScene extends Phaser.Scene {
    private logo!: Phaser.GameObjects.Text;
    private subtitle!: Phaser.GameObjects.Text;
    private playButton!: Phaser.GameObjects.Text;
    private portfolioButton!: Phaser.GameObjects.Text;
    private backgroundPattern!: Phaser.GameObjects.TileSprite;

    constructor() {
        super({ key: "WelcomeScene" });
    }

    preload() {
        // Create simple colored rectangles as placeholders for buttons
        this.load.image(
            "pixel",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        );

        // Load the same block assets as MainScene for background
        this.load.image(
            "mid_part1",
            "assets/blocks/manor/mid_part/fill_up.png"
        );
        this.load.image(
            "most_top1",
            "assets/blocks/manor/most_top/block_all_adjacent.png"
        );
    }

    create() {
        const { width, height } = this.cameras.main;

        // Create a subtle animated background pattern
        this.backgroundPattern = this.add.tileSprite(
            0,
            0,
            width,
            height,
            "mid_part1"
        );
        this.backgroundPattern.setOrigin(0, 0);
        this.backgroundPattern.setAlpha(0.1);
        this.backgroundPattern.setTint(0x4a9eff);

        // Add background gradient effect
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        gradient.fillRect(0, 0, width, height);
        gradient.setAlpha(0.8);

        // Main title - Growtopia style
        this.logo = this.add
            .text(width / 2, height * 0.25, "XYTOPIA", {
                fontFamily: "Arial Black, sans-serif",
                fontSize: "64px",
                color: "#4a9eff",
                stroke: "#ffffff",
                strokeThickness: 4,
                shadow: {
                    offsetX: 4,
                    offsetY: 4,
                    color: "#000000",
                    blur: 8,
                    stroke: false,
                    fill: true,
                },
            })
            .setOrigin(0.5);

        // Subtitle
        this.subtitle = this.add
            .text(
                width / 2,
                height * 0.35,
                "Interactive Portfolio Experience",
                {
                    fontFamily: "Arial, sans-serif",
                    fontSize: "24px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 2,
                }
            )
            .setOrigin(0.5);

        // Play Game Button (Enter World)
        this.playButton = this.createButton(
            width / 2,
            height * 0.55,
            "ENTER WORLD",
            0x4caf50,
            () => {
                this.scene.start("MainScene");
            }
        );

        // Portfolio Button
        this.portfolioButton = this.createButton(
            width / 2,
            height * 0.7,
            "VIEW PORTFOLIO",
            0x2196f3,
            () => {
                // This will trigger a React navigation or modal
                window.dispatchEvent(new CustomEvent("navigateToPortfolio"));
            }
        );

        // Store subtitle reference for potential future use
        this.subtitle.setInteractive();

        // Add floating animation to title
        this.tweens.add({
            targets: this.logo,
            y: this.logo.y - 10,
            duration: 2000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1,
        });

        // Animate background pattern
        this.tweens.add({
            targets: this.backgroundPattern,
            tilePositionX: 100,
            tilePositionY: 50,
            duration: 20000,
            repeat: -1,
            ease: "Linear",
        });

        // Add some floating particles effect
        this.createFloatingParticles();
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        color: number,
        callback: () => void
    ): Phaser.GameObjects.Text {
        // Create button background
        const buttonBg = this.add.rectangle(x, y, 280, 60, color, 0.8);
        buttonBg.setStrokeStyle(3, 0xffffff);

        // Create button text
        const buttonText = this.add
            .text(x, y, text, {
                fontFamily: "Arial Black, sans-serif",
                fontSize: "20px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5);

        // Make button interactive
        buttonBg.setInteractive({ useHandCursor: true });
        buttonText.setInteractive({ useHandCursor: true });

        // Hover effects
        const hoverTween = (
            target: Phaser.GameObjects.GameObject,
            scale: number
        ) => {
            this.tweens.add({
                targets: target,
                scaleX: scale,
                scaleY: scale,
                duration: 150,
                ease: "Power2",
            });
        };

        [buttonBg, buttonText].forEach((obj) => {
            obj.on("pointerover", () => {
                hoverTween(buttonBg, 1.1);
                hoverTween(buttonText, 1.1);
                buttonBg.setFillStyle(color, 1);
            });

            obj.on("pointerout", () => {
                hoverTween(buttonBg, 1);
                hoverTween(buttonText, 1);
                buttonBg.setFillStyle(color, 0.8);
            });

            obj.on("pointerdown", callback);
        });

        return buttonText;
    }

    private createFloatingParticles() {
        // Create some floating block particles for atmosphere
        for (let i = 0; i < 10; i++) {
            const particle = this.add.image(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                "most_top1"
            );
            particle.setScale(0.1);
            particle.setAlpha(0.3);
            particle.setTint(Phaser.Math.Between(0x4a9eff, 0x87ceeb));

            // Random floating animation
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-50, 50),
                y: particle.y + Phaser.Math.Between(-30, 30),
                rotation: Phaser.Math.Between(-0.5, 0.5),
                duration: Phaser.Math.Between(3000, 6000),
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
            });
        }
    }
}
