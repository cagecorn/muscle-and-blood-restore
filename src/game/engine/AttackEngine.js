// src/game/engine/AttackEngine.js

/**
 * 공격과 관련된 모든 계산을 처리하는 엔진입니다.
 */
export const attackEngine = {
    /**
     * 공격을 수행하고 대상에게 피해를 입힙니다.
     * @param {object} attacker - 공격하는 유닛 객체
     * @param {object} target - 공격받는 유닛 객체
     */
    performAttack: (attacker, target) => {
        // 기본 대미지는 공격자의 공격력(atk) 스탯을 따릅니다.
        const damage = attacker.finalStats.atk;
        
        // 대상의 현재 체력을 감소시킵니다.
        target.currentHp -= damage;

        console.log(`%c${attacker.name}이(가) ${target.name}에게 ${damage}의 피해를 입혔습니다! (남은 체력: ${target.currentHp})`, "color: orange");

        // 체력이 0 미만으로 내려가지 않도록 보정합니다.
        if (target.currentHp < 0) {
            target.currentHp = 0;
        }
    }
};
