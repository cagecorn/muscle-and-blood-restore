import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';

/**
 * 적 부대를 표현하는 컨테이너.
 * 플레이어 부대와 동일한 구성으로 좌우가 반전된 스프라이트를 사용합니다.
 * 스탯과 같은 유닛 데이터는 외부에서 주입됩니다.
 */
export class EnemySquad extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene 부대가 추가될 씬
     * @param {number} x 시작 x 좌표
     * @param {number} y 시작 y 좌표
     */
    constructor(scene, x, y) {
        super(scene, x, y);

        // 1. 워리어, 거너, 메딕 스프라이트 생성 및 좌우반전
        const warrior = scene.add.sprite(0, 10, 'warrior').setScale(0.7).setFlipX(true);
        const gunner = scene.add.sprite(-25, -10, 'gunner').setScale(0.7).setFlipX(true);
        const medic = scene.add.sprite(25, -10, 'medic').setScale(0.7).setFlipX(true);

        // 2. Y-맵핑 (depth) 적용
        gunner.setDepth(1);
        medic.setDepth(1);
        warrior.setDepth(2);

        // 3. 컨테이너에 스프라이트 추가
        this.add([gunner, medic, warrior]);

        // 4. 컨테이너를 씬에 추가하고 물리 활성화
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setSize(warrior.displayWidth, warrior.displayHeight);
    }
}
