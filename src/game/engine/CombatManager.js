// src/game/engine/CombatManager.js

import { attackEngine } from './AttackEngine.js';

/**
 * 전투의 전체 흐름을 관리합니다.
 */
export class CombatManager {
    /**
     * @param {Phaser.Scene} scene - 매니저를 소유한 씬
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 두 부대 간의 전투 턴을 시작합니다.
     * @param {object} playerSquad - 아군 부대 객체
     * @param {object} enemySquad - 적군 부대 객체
     */
    initiateCombatTurn(playerSquad, enemySquad) {
        console.log("%c 전투 시작!", "color: red; font-size: 16px;");

        // 1. 모든 유닛 목록 생성 및 팀 지정
        const playerUnits = Object.values(playerSquad.units);
        playerUnits.forEach(u => u.team = 'player');

        const enemyUnits = Object.values(enemySquad.units);
        enemyUnits.forEach(u => u.team = 'enemy');

        const allUnits = [...playerUnits, ...enemyUnits];
        allUnits.sort((a, b) => a.finalStats.weight - b.finalStats.weight);

        console.log("이번 턴 행동 순서:", allUnits.map(u => `${u.name} (무게: ${u.finalStats.weight})`));

        // 각 부대의 리더와 후방 유닛을 정의
        const playerLeader = playerSquad.units.commander;
        const enemyLeader = enemySquad.units.warrior;
        const playerBackline = [playerSquad.units.gunner, playerSquad.units.medic];
        const enemyBackline = [enemySquad.units.gunner, enemySquad.units.medic];

        allUnits.forEach((unit, index) => {
            this.scene.time.delayedCall(400 * index, () => {
                if (playerLeader.currentHp <= 0 || enemyLeader.currentHp <= 0) return;

                // === 유닛 역할에 따른 행동 분기 ===
                switch (unit.name) {
                    case 'Medic':
                        // 메딕: 소속 팀의 리더를 치유
                        const leaderToHeal = unit.team === 'player' ? playerLeader : enemyLeader;
                        attackEngine.performHeal(unit, leaderToHeal);
                        break;

                    case 'Gunner':
                        // 거너: 50% 확률로 적 리더 또는 적 후방 유닛 공격
                        const targetLeader = unit.team === 'player' ? enemyLeader : playerLeader;
                        const targetBackline = unit.team === 'player' ? enemyBackline : playerBackline;
                        let target;

                        if (Math.random() < 0.5) {
                            const aliveBackliners = targetBackline.filter(u => u.currentHp > 0);
                            if (aliveBackliners.length > 0) {
                                target = aliveBackliners[Math.floor(Math.random() * aliveBackliners.length)];
                            } else {
                                target = targetLeader;
                            }
                        } else {
                            target = targetLeader;
                        }
                        attackEngine.performAttack(unit, target);
                        break;

                    default:
                        // 지휘관(역병 의사, 워리어): 서로의 리더를 공격
                        const opponentLeader = unit.team === 'player' ? enemyLeader : playerLeader;
                        attackEngine.performAttack(unit, opponentLeader);
                        break;
                }
            });
        });

        const totalTurnTime = 400 * allUnits.length;
        this.scene.time.delayedCall(totalTurnTime + 500, () => {
            console.log("%c 전투 턴 종료.", "color: blue;");

            if (playerLeader.currentHp <= 0) {
                console.log("아군 패배!");
                this.scene.scene.start('GameOver');
            } else if (enemyLeader.currentHp <= 0) {
                console.log("적군 승리!");
                enemySquad.destroy();
                // 체력바가 부대 객체에 연결되어 있지 않으므로, 씬에서 직접 제거
                this.scene.enemyHealthBar.destroy();
            }

            this.scene.isBattling = false;
        });
    }
}
