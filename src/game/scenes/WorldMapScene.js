import { Scene } from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';
import { WorldMapEngine } from '../utils/WorldMapEngine.js';
import { WorldMapTurnEngine } from '../utils/WorldMapTurnEngine.js';
import { CameraControlEngine } from '../utils/CameraControlEngine.js';
import { squadEngine } from '../utils/SquadEngine.js';
import { AnimationEngine } from '../utils/AnimationEngine.js';

export class WorldMapScene extends Scene {
    constructor() {
        super('WorldMapScene');
        /** @type {?import('../entities/Squad.js').Squad} */
        this.squad = null;
        this.mapEngine = null;
        this.animationEngine = null;
    }

    create() {
        const territoryContainer = document.getElementById('territory-container');
        if (territoryContainer) {
            territoryContainer.style.display = 'none';
        }

        this.mapEngine = new WorldMapEngine(this);
        this.mapEngine.create();

        // AnimationEngine 인스턴스 생성
        this.animationEngine = new AnimationEngine(this);

        // 1. 부대 생성 (맵 중앙)
        const startTileX = Math.floor(this.mapEngine.MAP_WIDTH_IN_TILES / 2);
        const startTileY = Math.floor(this.mapEngine.MAP_HEIGHT_IN_TILES / 2);
        const startX = startTileX * this.mapEngine.TILE_WIDTH + this.mapEngine.TILE_WIDTH / 2;
        const startY = startTileY * this.mapEngine.TILE_HEIGHT + this.mapEngine.TILE_HEIGHT / 2;

        this.squad = squadEngine.createSquad(this, startX, startY);
        this.squad.tileX = startTileX;
        this.squad.tileY = startTileY;

        // 2. 턴 엔진 및 카메라 설정
        new WorldMapTurnEngine(this);
        new CameraControlEngine(this);

        this.cameras.main.startFollow(this.squad, true, 0.08, 0.08);
        this.cameras.main.setZoom(1);

        this.input.keyboard.on('keydown-T', () => {
            this.scene.start('TerritoryScene');
        });

        this.events.on('shutdown', () => {
            if (territoryContainer) {
                territoryContainer.style.display = 'block';
            }
        });
    }

    /**
     * 부대를 지정된 방향으로 한 칸 이동시킵니다.
     * @param {'up' | 'down' | 'left' | 'right'} direction
     */
    moveSquad(direction) {
        let targetX = this.squad.tileX;
        let targetY = this.squad.tileY;

        switch (direction) {
            case 'up': targetY -= 1; break;
            case 'down': targetY += 1; break;
            case 'left': targetX -= 1; break;
            case 'right': targetX += 1; break;
        }

        if (targetX >= 0 && targetX < this.mapEngine.MAP_WIDTH_IN_TILES &&
            targetY >= 0 && targetY < this.mapEngine.MAP_HEIGHT_IN_TILES) {

            this.squad.tileX = targetX;
            this.squad.tileY = targetY;

            const worldX = targetX * this.mapEngine.TILE_WIDTH + this.mapEngine.TILE_WIDTH / 2;
            const worldY = targetY * this.mapEngine.TILE_HEIGHT + this.mapEngine.TILE_HEIGHT / 2;

            // AnimationEngine을 사용하여 부드러운 이동 애니메이션 적용
            this.animationEngine.moveTo(this.squad, worldX, worldY, 200);
        }
    }
}
