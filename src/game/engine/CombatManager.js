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

        // 1. 모든 유닛 목록 생성
        const playerUnits = Object.values(playerSquad.units);
        playerUnits.forEach(u => u.team = 'player'); // 팀 구분용 속성 추가

        const enemyUnits = Object.values(enemySquad.units);
        enemyUnits.forEach(u => u.team = 'enemy');

        const allUnits = [...playerUnits, ...enemyUnits];

        // 2. 'weight' 스탯을 기준으로 행동 순서 정렬 (가벼운 유닛이 먼저)
        allUnits.sort((a, b) => a.finalStats.weight - b.finalStats.weight);

        console.log("이번 턴 행동 순서:", allUnits.map(u => `${u.name} (무게: ${u.finalStats.weight})`));

        // 3. 정해진 순서대로 공격 수행
        const playerLeader = playerSquad.units.commander;
        const enemyLeader = enemySquad.units.warrior;

        allUnits.forEach((attacker, index) => {
            // 각 유닛이 순차적으로 공격하는 것처럼 보이도록 시간차를 둡니다.
            this.scene.time.delayedCall(300 * index, () => {
                // 리더 유닛 중 하나라도 쓰러졌으면 전투를 중단합니다.
                if (playerLeader.currentHp <= 0 || enemyLeader.currentHp <= 0) {
                    return;
                }

                // 공격 대상 지정 (아군 -> 적 리더, 적군 -> 아군 리더)
                const target = attacker.team === 'player' ? enemyLeader : playerLeader;
                attackEngine.performAttack(attacker, target);
            });
        });
        
        // 모든 공격이 끝난 후 전투 상태를 해제합니다.
        const totalTurnTime = 300 * allUnits.length;
        this.scene.time.delayedCall(totalTurnTime + 500, () => {
            console.log("%c 전투 턴 종료.", "color: blue;");
            
            if (playerLeader.currentHp <= 0) {
                console.log("아군 패배!");
                this.scene.scene.start('GameOver');
            } else if (enemyLeader.currentHp <= 0) {
                console.log("적군 패배!");
                // 여기서 승리 로직을 추가할 수 있습니다. (예: 적 부대 제거)
                enemySquad.destroy();
                enemySquad.healthBar.destroy();
            }
            
            // 전투가 끝났으므로 다시 움직일 수 있습니다.
            this.scene.isBattling = false;
        });
    }
}
