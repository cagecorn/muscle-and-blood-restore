export class WorldMapTurnEngine {
    /**
     * @param {Phaser.Scene} scene 제어할 씬
     * @param {import('../ai/Node.js').Node} [enemyAI] 적 AI 루트 노드
     */
    constructor(scene, enemyAI) {
        this.scene = scene;
        this.enemyAI = enemyAI;
        this.isPlayerTurn = true;
        this.setupKeyboardControls();
    }

    /**
     * 키보드 방향키 입력을 설정합니다.
     */
    setupKeyboardControls() {
        this.scene.input.keyboard.on('keydown-UP', () => this.handleMove('up'));
        this.scene.input.keyboard.on('keydown-DOWN', () => this.handleMove('down'));
        this.scene.input.keyboard.on('keydown-LEFT', () => this.handleMove('left'));
        this.scene.input.keyboard.on('keydown-RIGHT', () => this.handleMove('right'));
    }

    /**
     * 이동을 처리하고 적 AI 턴을 실행합니다.
     * @param {'up' | 'down' | 'left' | 'right'} direction
     */
    handleMove(direction) {
        if (!this.isPlayerTurn) return;

        this.isPlayerTurn = false;

        // 플레이어 이동
        this.scene.moveSquad(direction);

        // 적 AI 행동 수행 후 턴 반환
        this.scene.time.delayedCall(300, () => {
            if (this.enemyAI) {
                this.enemyAI.execute();
            }
            this.isPlayerTurn = true;
        });
    }
}
