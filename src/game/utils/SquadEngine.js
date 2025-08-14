import { Squad } from '../entities/Squad.js';

/**
 * Squad 클래스를 생성하는 간단한 엔진
 */
class SquadEngine {
    /**
     * 지정된 위치에 새로운 부대를 생성합니다.
     * @param {Phaser.Scene} scene 부대가 생성될 씬
     * @param {number} x x 좌표
     * @param {number} y y 좌표
     * @returns {Squad}
     */
    createSquad(scene, x, y) {
        return new Squad(scene, x, y);
    }
}

export const squadEngine = new SquadEngine();

