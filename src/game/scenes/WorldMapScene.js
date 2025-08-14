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
import { CombatManager } from '../engine/CombatManager.js';

export class WorldMapScene extends Scene {
    constructor() {
        super('WorldMapScene');
        this.squad = null;
        this.enemySquad = null;
        this.mapEngine = null;
        this.animationEngine = null;
        this.turnEngine = null;
        this.ai = null;
        this.isBattling = false;
        this.playerHealthBar = null;
        this.enemyHealthBar = null;
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

        // === 스탯 설정 로직 수정: 유닛을 부대 객체 내부에 저장 ===

        // 1. 아군 부대 유닛 설정
        this.squad.units = {
            commander: this.createUnitData(mercenaryData.plagueDoctor),
            gunner: this.createUnitData(mercenaryData.gunner),
            medic: this.createUnitData(mercenaryData.medic)
        };
        
        // 2. 적군 부대 유닛 설정
        this.enemySquad.units = {
            warrior: this.createUnitData(mercenaryData.warrior),
            gunner: this.createUnitData(mercenaryData.gunner),
            medic: this.createUnitData(mercenaryData.medic)
        };
        
        // 체력바 생성
        this.playerHealthBar = new HealthBar(this, this.squad.x - 30, this.squad.y - 40);
        this.enemyHealthBar = new HealthBar(this, this.enemySquad.x - 30, this.enemySquad.y - 40);

        // 전투 관리자 생성
        this.combatManager = new CombatManager(this);

        // === 충돌 및 전투 시작 로직 추가 ===
        this.physics.add.collider(this.squad, this.enemySquad, this.handleSquadCollision, null, this);

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

    /**
     * 유닛 데이터를 생성하고 초기화하는 헬퍼 함수
     * @param {object} unitBaseData - mercenaryData에서 가져온 유닛 원본 데이터
     * @returns {object} 게임에서 사용할 유닛 데이터
     */
    createUnitData(unitBaseData) {
        const finalStats = statEngine.calculateStats(unitBaseData, unitBaseData.baseStats, []);
        return {
            ...unitBaseData,
            finalStats,
            currentHp: finalStats.hp
        };
    }
    
    /**
     * 부대 충돌 시 호출되는 콜백 함수
     * @param {Phaser.GameObjects.Sprite} squad - 아군 부대
     * @param {Phaser.GameObjects.Sprite} enemySquad - 적군 부대
     */
    handleSquadCollision(squad, enemySquad) {
        // 이미 전투 중이면 아무것도 하지 않음
        if (this.isBattling) return;

        // 전투 상태로 전환
        this.isBattling = true;
        
        // 전투가 시작되면 두 부대 모두 정지
        squad.body.stop();
        enemySquad.body.stop();
        
        // CombatManager를 통해 전투 턴 시작
        this.combatManager.initiateCombatTurn(squad, enemySquad);
    }

    update() {
        // 전투 중이 아닐 때만 부대 이동 처리
        if (!this.isBattling) {
            // 기존의 이동 로직 (this.squad.body.setVelocity, this.moveEnemySquad 등)
            // ...
        }
        
        // 체력바 위치 및 값 업데이트
        if (this.squad && this.playerHealthBar) {
            this.playerHealthBar.setPosition(this.squad.x - 30, this.squad.y - 50);
            const playerHpPercent = (this.squad.units.commander.currentHp / this.squad.units.commander.finalStats.hp) * 100;
            this.playerHealthBar.setHealth(playerHpPercent);
        }

        if (this.enemySquad && this.enemyHealthBar && this.enemySquad.active) {
            this.enemyHealthBar.setPosition(this.enemySquad.x - 30, this.enemySquad.y - 50);
            const enemyHpPercent = (this.enemySquad.units.warrior.currentHp / this.enemySquad.units.warrior.finalStats.hp) * 100;
            this.enemyHealthBar.setHealth(enemyHpPercent);
        } else if (this.enemyHealthBar && !this.enemySquad.active) {
            // 적이 비활성화(파괴)되면 체력바도 숨김
            this.enemyHealthBar.destroy();
            this.enemyHealthBar = null;
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
