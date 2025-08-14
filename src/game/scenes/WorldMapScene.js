import { Scene } from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';
import { WorldMapEngine } from '../utils/WorldMapEngine.js';
import { WorldMapTurnEngine } from '../utils/WorldMapTurnEngine.js';
import { CameraControlEngine } from '../utils/CameraControlEngine.js';
import { squadEngine } from '../utils/SquadEngine.js';
import { AnimationEngine } from '../utils/AnimationEngine.js';
import { EnemySquad } from '../entities/EnemySquad.js';
import { Blackboard } from '../ai/Blackboard.js';
import { Sequence } from '../ai/Sequence.js';
import { MoveTowardsPlayerNode } from '../ai/MoveTowardsPlayerNode.js';
import { mercenaryData } from '../data/mercenaries.js';
import { statEngine } from '../utils/StatEngine.js';
import { HealthBar } from '../ui/HealthBar.js';

export class WorldMapScene extends Scene {
    constructor() {
        super('WorldMapScene');
        this.squad = null;
        this.enemySquad = null;
        this.mapEngine = null;
        this.animationEngine = null;
        this.turnEngine = null;
        this.ai = null;
    }

    create() {
        const territoryContainer = document.getElementById('territory-container');
        if (territoryContainer) {
            territoryContainer.style.display = 'none';
        }

        this.mapEngine = new WorldMapEngine(this);
        this.mapEngine.create();

        this.animationEngine = new AnimationEngine(this);

        // 플레이어 부대 생성
        const playerStartTileX = 5;
        const playerStartTileY = Math.floor(this.mapEngine.MAP_HEIGHT_IN_TILES / 2);
        this.squad = squadEngine.createSquad(
            this,
            playerStartTileX * this.mapEngine.TILE_WIDTH + this.mapEngine.TILE_WIDTH / 2,
            playerStartTileY * this.mapEngine.TILE_HEIGHT + this.mapEngine.TILE_HEIGHT / 2
        );
        this.squad.tileX = playerStartTileX;
        this.squad.tileY = playerStartTileY;

        // 적 부대 생성 (맵 반대편)
        const enemyStartTileX = this.mapEngine.MAP_WIDTH_IN_TILES - 5;
        const enemyStartTileY = Math.floor(this.mapEngine.MAP_HEIGHT_IN_TILES / 2);
        this.enemySquad = new EnemySquad(
            this,
            enemyStartTileX * this.mapEngine.TILE_WIDTH + this.mapEngine.TILE_WIDTH / 2,
            enemyStartTileY * this.mapEngine.TILE_HEIGHT + this.mapEngine.TILE_HEIGHT / 2
        );
        this.enemySquad.tileX = enemyStartTileX;
        this.enemySquad.tileY = enemyStartTileY;

        // === 스탯 설정 로직 추가 시작 ===
        const plagueDoctorData = mercenaryData.plagueDoctor;
        this.squad.commander = {
            ...plagueDoctorData,
            finalStats: statEngine.calculateStats(plagueDoctorData, plagueDoctorData.baseStats)
        };

        const warriorData = mercenaryData.warrior;
        this.enemySquad.warrior = {
            ...warriorData,
            finalStats: statEngine.calculateStats(warriorData, warriorData.baseStats)
        };

        const gunnerData = mercenaryData.gunner;
        this.squad.gunnerStats = statEngine.calculateStats(gunnerData, gunnerData.baseStats);
        this.enemySquad.gunnerStats = this.squad.gunnerStats;

        const medicData = mercenaryData.medic;
        this.squad.medicStats = statEngine.calculateStats(medicData, medicData.baseStats);
        this.enemySquad.medicStats = this.squad.medicStats;

        this.squad.commander.currentHp = this.squad.commander.finalStats.hp;
        this.enemySquad.warrior.currentHp = this.enemySquad.warrior.finalStats.hp;
        // === 스탯 설정 로직 추가 종료 ===

        // === 체력바 생성 로직 추가 시작 ===
        this.playerHealthBar = new HealthBar(this, this.squad.x - 30, this.squad.y - 40);
        this.enemyHealthBar = new HealthBar(this, this.enemySquad.x - 30, this.enemySquad.y - 40);
        // === 체력바 생성 로직 추가 종료 ===

        // AI 설정
        const blackboard = new Blackboard();
        blackboard.set('player', this.squad);
        blackboard.set('self', this.enemySquad);

        this.ai = new Sequence(blackboard, [
            new MoveTowardsPlayerNode(blackboard, this)
        ]);

        // 턴 엔진 및 카메라 설정
        this.turnEngine = new WorldMapTurnEngine(this, this.ai);
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

    update() {
        if (this.squad && this.playerHealthBar) {
            this.playerHealthBar.setPosition(this.squad.x - 30, this.squad.y - 50);
            const playerHpPercent = (this.squad.commander.currentHp / this.squad.commander.finalStats.hp) * 100;
            this.playerHealthBar.setHealth(playerHpPercent);
        }

        if (this.enemySquad && this.enemyHealthBar) {
            this.enemyHealthBar.setPosition(this.enemySquad.x - 30, this.enemySquad.y - 50);
            const enemyHpPercent = (this.enemySquad.warrior.currentHp / this.enemySquad.warrior.finalStats.hp) * 100;
            this.enemyHealthBar.setHealth(enemyHpPercent);
        }
    }

    // 플레이어 부대 이동 메서드
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
            this.animationEngine.moveTo(this.squad, worldX, worldY, 200);
        }
    }

    // 적 부대 이동 메서드
    moveEnemySquad(direction) {
        let targetX = this.enemySquad.tileX;
        let targetY = this.enemySquad.tileY;

        switch (direction) {
            case 'up': targetY -= 1; break;
            case 'down': targetY += 1; break;
            case 'left': targetX -= 1; break;
            case 'right': targetX += 1; break;
        }

        if (targetX >= 0 && targetX < this.mapEngine.MAP_WIDTH_IN_TILES &&
            targetY >= 0 && targetY < this.mapEngine.MAP_HEIGHT_IN_TILES) {

            this.enemySquad.tileX = targetX;
            this.enemySquad.tileY = targetY;
            const worldX = targetX * this.mapEngine.TILE_WIDTH + this.mapEngine.TILE_WIDTH / 2;
            const worldY = targetY * this.mapEngine.TILE_HEIGHT + this.mapEngine.TILE_HEIGHT / 2;
            this.animationEngine.moveTo(this.enemySquad, worldX, worldY, 200);
        }
    }
}
