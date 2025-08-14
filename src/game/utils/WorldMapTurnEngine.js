export class WorldMapTurnEngine {
    /**
     * @param {Phaser.Scene} scene 제어할 씬
     */
    constructor(scene) {
        this.scene = scene;
        this.hasMovedThisTurn = false;
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
     * 이동을 처리하고 턴을 넘깁니다.
     * @param {'up' | 'down' | 'left' | 'right'} direction
     */
    handleMove(direction) {
        if (!this.isPlayerTurn || this.hasMovedThisTurn) return;

        this.isPlayerTurn = false;
        this.hasMovedThisTurn = true;

        // WorldMapScene의 moveSquad 메서드를 호출합니다.
        this.scene.moveSquad(direction);

        this.scene.time.delayedCall(200, () => {
            this.isPlayerTurn = true;
            this.hasMovedThisTurn = false;
        });
    }
}

