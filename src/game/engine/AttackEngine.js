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
        // 공격 대상이 이미 쓰러졌다면 아무것도 하지 않음
        if (target.currentHp <= 0) {
            console.log(`${target.name}은(는) 이미 쓰러져 있습니다.`);
            return;
        }

        const damage = attacker.finalStats.atk;
        target.currentHp -= damage;

        console.log(`%c${attacker.name}이(가) ${target.name}에게 ${damage}의 피해를 입혔습니다! (남은 체력: ${target.currentHp})`, "color: orange");

        if (target.currentHp < 0) {
            target.currentHp = 0;
        }
    },

    /**
     * 대상을 치유합니다.
     * @param {object} healer - 치유하는 유닛 객체 (메딕)
     * @param {object} target - 치유받는 유닛 객체
     */
    performHeal: (healer, target) => {
        // 치유 대상이 이미 쓰러졌다면 아무것도 하지 않음
        if (target.currentHp <= 0) return;

        // 치유량은 메딕의 지혜(wisdom) 스탯을 따릅니다.
        const healAmount = healer.finalStats.wisdom;
        target.currentHp += healAmount;

        // 최대 체력을 초과하지 않도록 보정합니다.
        const maxHp = target.finalStats.hp;
        if (target.currentHp > maxHp) {
            target.currentHp = maxHp;
        }

        console.log(`%c${healer.name}이(가) ${target.name}을(를) ${healAmount}만큼 치유했습니다! (현재 체력: ${target.currentHp})`, "color: green");
    }
};
