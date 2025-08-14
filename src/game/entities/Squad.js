import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';

/**
 * 지휘관, 거너, 메딕으로 구성된 부대를 나타내는 컨테이너
 */
export class Squad extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene 부대가 추가될 씬
     * @param {number} x 시작 x 좌표
     * @param {number} y 시작 y 좌표
     */
    constructor(scene, x, y) {
        super(scene, x, y);

        // 1. 지휘관, 거너, 메딕 스프라이트 생성
        // 지휘관은 요청대로 타일보다 작게 축소합니다.
        const commander = scene.add.sprite(0, 10, 'leader-infp').setScale(0.15);
        const gunner = scene.add.sprite(-25, -10, 'gunner').setScale(0.1);
        const medic = scene.add.sprite(25, -10, 'medic').setScale(0.1);

        // 2. Y-맵핑 적용 (depth가 높을수록 앞에 보임)
        // 지휘관이 더 앞에 있도록 depth 값을 높게 설정합니다.
        gunner.setDepth(1);
        medic.setDepth(1);
        commander.setDepth(2);

        // 3. 컨테이너에 스프라이트 추가
        this.add([gunner, medic, commander]);

        // 4. 컨테이너를 씬에 추가
        scene.add.existing(this);
        scene.physics.world.enable(this);

        // 컨테이너의 크기를 설정하여 물리 상호작용 범위를 명확히 합니다.
        this.body.setSize(commander.displayWidth, commander.displayHeight);
    }
}

