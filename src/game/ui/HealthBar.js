import { Scene } from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';

export class HealthBar {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, x, y, width = 60, height = 8) {
        this.bar = scene.add.graphics();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = 100;

        this.draw();
        
        scene.add.existing(this.bar);
    }

    /**
     * @param {number} amount
     */
    setHealth(amount) {
        this.value = Math.max(0, Math.min(100, amount));
        this.draw();
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    draw() {
        this.bar.clear();

        // 배경
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // 체력
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        const d = Math.floor((this.width - 4) * (this.value / 100));

        this.bar.fillRect(this.x + 2, this.y + 2, d, this.height - 4);
    }
    
    destroy() {
        this.bar.destroy();
    }
}
