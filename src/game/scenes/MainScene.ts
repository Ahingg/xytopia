import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
    private playerContainer!: Phaser.GameObjects.Container;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
    private parts!: { [key: string]: Phaser.GameObjects.Sprite };
    private currentZoom: number = 1.5;
    private minZoom: number = 1.2;
    private maxZoom: number = 2.0;
    private worldWidth!: number;
    private worldHeight!: number;
    private horizonY!: number;

    constructor() {
        // The 'key' is how we will refer to this Scene later
        super({ key: "MainScene" });
    }

    // preload() is called once, to load your assets
    preload() {
        this.load.image("torso", "assets/growtopian/torso_blink.png");
        this.load.image("leftArm", "assets/growtopian/left_hand.png");
        this.load.image("rightArm", "assets/growtopian/right_hand.png");
        this.load.image("leftLeg", "assets/growtopian/left_leg.png");
        this.load.image("rightLeg", "assets/growtopian/right_leg.png");
        this.load.image("head", "assets/growtopian/eyes_open.png");

        this.load.image(
            "mid_part1",
            "assets/blocks/manor/mid_part/fill_up.png"
        );
        this.load.image(
            "mid_part2",
            "assets/blocks/manor/mid_part/fill_up2.png"
        );
        this.load.image(
            "mid_part3",
            "assets/blocks/manor/mid_part/fill_up3.png"
        );
        this.load.image(
            "mid_part4",
            "assets/blocks/manor/mid_part/fill_up4.png"
        );
        this.load.image(
            "mid_part5",
            "assets/blocks/manor/mid_part/fill_up5.png"
        );

        this.load.image(
            "most_bottom1",
            "assets/blocks/manor/most_bottom/block_most_bottom_follow.png"
        );
        this.load.image(
            "most_bottom2",
            "assets/blocks/manor/most_bottom/block_most_bottom_mid.png"
        );
        this.load.image(
            "most_bottom3",
            "assets/blocks/manor/most_bottom/block_most_bottom.png"
        );
        this.load.image(
            "most_bottom4",
            "assets/blocks/manor/most_bottom/most_bottom_follow2.png"
        );
        this.load.image(
            "most_bottom5",
            "assets/blocks/manor/most_bottom/most_bottom_follow3.png"
        );

        this.load.image(
            "most_top1",
            "assets/blocks/manor/most_top/block_all_adjacent.png"
        );
        this.load.image(
            "most_top2",
            "assets/blocks/manor/most_top/block_no_left.png"
        );
        this.load.image(
            "most_top3",
            "assets/blocks/manor/most_top/block_no_right.png"
        );
        this.load.image(
            "most_top4",
            "assets/blocks/manor/most_top/block_single.png"
        );

        // Load weather background assets
        this.load.image("sky", "assets/weather/sky_pg.png");
        this.load.image("moon", "assets/weather/moon.png");
        this.load.image("hills1", "assets/weather/hills1_pg.png"); // Front hills
        this.load.image("hills2", "assets/weather/hills2_pg.png"); // Middle hills
        this.load.image("hills3", "assets/weather/hills3_pg.png"); // Back hills
    }

    // create() is called once, after preload, to set up the scene
    create() {
        const TILE_SIZE = 32;
        const WORLD_WIDTH = 100; // Growtopia standard width
        const WORLD_HEIGHT = 54; // Growtopia standard height

        // Store world dimensions for camera bounds
        this.worldWidth = WORLD_WIDTH * TILE_SIZE;
        this.worldHeight = WORLD_HEIGHT * TILE_SIZE;

        // --- FIX: Calculate the horizon line Y position ---
        const roadLevel = Math.floor(WORLD_HEIGHT * 0.5);
        const roadHeight = 3;
        this.horizonY = (roadLevel + roadHeight) * TILE_SIZE;

        // Create the layered weather background first so it's behind everything
        this.createWeatherBackground();

        // Create a more realistic Growtopia-style world
        const levelData = this.generateGrowtopiaWorld(
            WORLD_WIDTH,
            WORLD_HEIGHT
        );

        const groundGroup = this.physics.add.staticGroup();

        levelData.forEach((row: number[], y: number) => {
            row.forEach((tile: number, x: number) => {
                if (tile === 1) {
                    const worldX = x * TILE_SIZE;
                    const worldY = y * TILE_SIZE;
                    let blockKey = "mid_part1";

                    const isTopBlock = y > 0 && levelData[y - 1][x] === 0;
                    const isBottomBlock =
                        y < levelData.length - 1 && levelData[y + 1][x] === 0;

                    if (isTopBlock) {
                        if (x === 0) blockKey = "most_top3";
                        else if (x === row.length - 1) blockKey = "most_top2";
                        else blockKey = "most_top1";
                    } else if (isBottomBlock) {
                        if (x === 0) blockKey = "most_bottom1";
                        else if (x === row.length - 1)
                            blockKey = "most_bottom3";
                        else blockKey = "most_bottom2";
                    } else {
                        const rand = Phaser.Math.Between(1, 5);
                        blockKey = `mid_part${rand}`;
                    }
                    groundGroup
                        .create(worldX, worldY, blockKey)
                        .setOrigin(0, -0.125); // FIX: Reset origin to default for predictable physics
                }
            });
        });

        this.playerContainer = this.add.container(
            100,
            WORLD_HEIGHT * TILE_SIZE * 0.5 - TILE_SIZE
        ); // Start on the road
        const torso = this.add.sprite(0, 0, "torso");
        const head = this.add.sprite(0, 0, "head");
        const leftArm = this.add.sprite(0, 0, "leftArm");
        const rightArm = this.add.sprite(3, 5, "rightArm");
        const leftLeg = this.add.sprite(0, 10, "leftLeg");
        const rightLeg = this.add.sprite(0, 10, "rightLeg");

        this.playerContainer.add([
            leftLeg,
            rightLeg,
            rightArm,
            torso,
            leftArm,
            head,
        ]);
        leftArm.setDepth(3);
        torso.setDepth(2);
        rightArm.setDepth(1);
        this.playerContainer.setScale(0.185);
        this.parts = { torso, head, leftArm, rightArm, leftLeg, rightLeg };

        // Set up camera to follow player and set world bounds
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.playerContainer, true, 1, 0.08);
        this.cameras.main.setZoom(this.currentZoom);
        this.updateCameraBounds();

        // Setup physics
        this.physics.world.enable(this.playerContainer);
        (
            this.playerContainer.body as Phaser.Physics.Arcade.Body
        ).setCollideWorldBounds(true);
        (this.playerContainer.body as Phaser.Physics.Arcade.Body).setGravityY(
            300
        );

        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        const body = this.playerContainer.body as Phaser.Physics.Arcade.Body;
        body.setSize(12.8, 12.8);
        body.setOffset(-8, -8);

        this.physics.add.collider(this.playerContainer, groundGroup);

        this.cursors = this.input.keyboard?.createCursorKeys()!;
        this.keys =
            (this.input.keyboard?.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                zoomIn: Phaser.Input.Keyboard.KeyCodes.Q,
                zoomOut: Phaser.Input.Keyboard.KeyCodes.E,
            }) as { [key: string]: Phaser.Input.Keyboard.Key }) || {};

        this.input.on(
            "wheel",
            (
                _pointer: Phaser.Input.Pointer,
                _gameObjects: any[],
                _deltaX: number,
                deltaY: number
            ) => {
                this.handleZoom(deltaY > 0 ? -0.1 : 0.1);
            }
        );

        // Logic Blink
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (Math.random() < 0.5) {
                    this.parts.head.setVisible(false);
                    this.time.delayedCall(200, () => {
                        this.parts.head.setVisible(true);
                    });
                }
            },
            loop: true,
        });

        const controlsText = this.add.text(
            10,
            10,
            "Controls:\nArrow Keys / WASD: Move\nQ/E: Zoom In/Out\nMouse Wheel: Zoom",
            {
                fontSize: "12px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            }
        );
        controlsText.setScrollFactor(0);
        controlsText.setDepth(1000);
    }

    update(time: number): void {
        const body = this.playerContainer.body as Phaser.Physics.Arcade.Body;

        if (this.keys.zoomIn?.isDown) {
            this.handleZoom(0.02);
        } else if (this.keys.zoomOut?.isDown) {
            this.handleZoom(-0.02);
        }

        if (this.cursors.left?.isDown || this.keys.left?.isDown) {
            body.setVelocityX(-300);
            this.playerContainer.setScale(0.2, 0.2);
        } else if (this.cursors.right?.isDown || this.keys.right?.isDown) {
            body.setVelocityX(300);
            this.playerContainer.setScale(-0.2, 0.2);
        } else {
            body.setVelocityX(0);
        }

        if (
            (this.cursors.up?.isDown || this.keys.up?.isDown) &&
            body.touching.down
        ) {
            body.setVelocityY(-300);
        }

        const isMoving = body.velocity.x !== 0;

        if (isMoving) {
            const walkTime = time * 0.015;

            this.parts.leftLeg.y = Math.sin(walkTime) * 4;
            this.parts.rightLeg.y = Math.sin(walkTime + Math.PI) * 4;

            this.parts.leftArm.rotation = Math.sin(walkTime + Math.PI) * 0.175;
            this.parts.rightArm.rotation = Math.sin(walkTime) * 0.175;
        } else {
            this.parts.leftLeg.y = 0;
            this.parts.rightLeg.y = 0;
            this.parts.leftArm.rotation = 0;
            this.parts.rightArm.rotation = 0;
        }
    }

    private createWeatherBackground(): void {
        const { width: cameraWidth, height: cameraHeight } = this.cameras.main;

        // Layer 1: Sky - A single image fixed to the camera view.
        const skyBg = this.add
            .image(0, 0, "sky")
            .setOrigin(0, 0)
            .setDepth(-100)
            .setScrollFactor(0);
        skyBg.displayWidth = cameraWidth;
        skyBg.displayHeight = cameraHeight;

        // Layer 2: Moon - Fixed to the camera with a very slight parallax effect
        const moon = this.add
            .image(cameraWidth * 0.25, cameraHeight * 0.15, "moon")
            .setDepth(-90)
            .setScrollFactor(0.05);

        // Layer 3, 4, 5: Hills
        // --- FIX: Anchor hills to the horizon line, not the absolute bottom of the world ---
        this.add
           .tileSprite(
                0,
                this.horizonY,
                this.worldWidth,
                this.textures.get("hills3").getSourceImage().height,
                "hills3"
            )
            .setOrigin(0, 1) // Set origin to bottom-left
            .setDepth(-80)
            .setScrollFactor(0.1, 1); // Scroll slow horizontally, normal vertically

        this.add
            .tileSprite(
                0,
                this.horizonY,
                this.worldWidth,
                this.textures.get("hills2").getSourceImage().height,
                "hills2"
            )
            .setOrigin(0, 1)
            .setDepth(-70)
            .setScrollFactor(0.3, 1); // Medium speed

        this.add
            .tileSprite(
                0,
                this.horizonY,
                this.worldWidth,
                this.textures.get("hills1").getSourceImage().height,
                "hills1"
            )
            .setOrigin(0, 1)
            .setDepth(-60)
            .setScrollFactor(0.5, 1); // Fastest speed

        this.tweens.add({
            targets: moon,
            alpha: 0.8,
            duration: 3000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1,
        });
    }

    private generateGrowtopiaWorld(width: number, height: number): number[][] {
        const world: number[][] = [];

        for (let y = 0; y < height; y++) {
            world[y] = new Array(width).fill(0);
        }

        const roadLevel = Math.floor(height * 0.5);
        const roadHeight = 3;
        const surfaceLevel = roadLevel + roadHeight;
        const bedrock = height - 3;

        for (let x = 0; x < width; x++) {
            for (let y = roadLevel; y < roadLevel + roadHeight; y++) {
                world[y][x] = 0;
            }
        }

        for (let x = 0; x < width; x++) {
            for (
                let y = roadLevel + roadHeight;
                y < roadLevel + roadHeight + 6;
                y++
            ) {
                world[y][x] = 1;
            }
        }

        for (let x = 0; x < width; x++) {
            const undergroundVariation = Math.floor(
                Math.sin(x * 0.02) * 2 + Math.sin(x * 0.04) * 3
            );

            const undergroundStart = surfaceLevel + 2 + undergroundVariation;

            for (let y = undergroundStart; y < height; y++) {
                if (y <= undergroundStart + 8) {
                    world[y][x] = Math.random() < 0.85 ? 1 : 0;
                } else if (y < bedrock) {
                    world[y][x] = Math.random() < 0.95 ? 1 : 0;
                } else {
                    world[y][x] = 1;
                }
            }

            this.addCavesToWorld(world, x, undergroundStart, height);
        }

        this.addFloatingIslands(world, width, roadLevel);

        return world;
    }

    private addCavesToWorld(
        world: number[][],
        x: number,
        surface: number,
        height: number
    ): void {
        if (Math.random() < 0.02) {
            const caveStart = surface + 5 + Math.floor(Math.random() * 10);
            const caveHeight = 3 + Math.floor(Math.random() * 4);
            const caveWidth = 2 + Math.floor(Math.random() * 3);

            for (
                let cy = caveStart;
                cy < Math.min(caveStart + caveHeight, height - 3);
                cy++
            ) {
                for (
                    let cx = Math.max(0, x - Math.floor(caveWidth / 2));
                    cx <
                    Math.min(world[0].length, x + Math.ceil(caveWidth / 2));
                    cx++
                ) {
                    world[cy][cx] = 0;
                }
            }
        }
    }

    private addFloatingIslands(
        world: number[][],
        width: number,
        roadLevel: number
    ): void {
        const numIslands = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < numIslands; i++) {
            const islandX = Math.floor(Math.random() * (width - 10)) + 5;
            const islandY = Math.floor(Math.random() * (roadLevel - 8)) + 3;
            const islandSize = 3 + Math.floor(Math.random() * 3);

            for (let y = islandY; y < islandY + 2; y++) {
                for (let x = islandX; x < islandX + islandSize; x++) {
                    if (x < width && y >= 0) {
                        world[y][x] = 1;
                    }
                }
            }
        }
    }

    private handleZoom(zoomDelta: number): void {
        const newZoom = Phaser.Math.Clamp(
            this.currentZoom + zoomDelta,
            this.minZoom,
            this.maxZoom
        );

        if (newZoom !== this.currentZoom) {
            this.currentZoom = newZoom;
            this.cameras.main.setZoom(this.currentZoom);
            this.updateCameraBounds();
        }
    }

    private updateCameraBounds(): void {
        const camera = this.cameras.main;
        camera.setBounds(0, 0, this.worldWidth, this.worldHeight);
    }
}
