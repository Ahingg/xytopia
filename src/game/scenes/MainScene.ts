import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
    constructor() {
    // The 'key' is how we will refer to this Scene later
    super({ key: 'MainScene' });
  }

  // preload() is called once, to load your assets
  preload() {
    // For now, we are not loading any assets
  }

  // create() is called once, after preload, to set up the scene
  create() {
    // Add a text object to the center of the screen
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Hello from Phaser!',
      { font: '48px Arial', color: '#ffffff' }
    ).setOrigin(0.5);
  }
}