import { Node, NodeState } from './Node.js';

/**
 * 플레이어 위치를 향해 한 칸 이동하는 행동 노드.
 */
export class MoveTowardsPlayerNode extends Node {
    /**
     * @param {Blackboard} blackboard
     * @param {Phaser.Scene} scene
     */
    constructor(blackboard, scene) {
        super(blackboard);
        this.scene = scene;
    }

    /**
     * @returns {NodeState}
     */
    execute() {
        const player = this.blackboard.get('player');
        const self = this.blackboard.get('self');

        if (!player || !self) {
            return NodeState.FAILURE;
        }

        const dx = player.tileX - self.tileX;
        const dy = player.tileY - self.tileY;

        let direction = null;
        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
        } else if (Math.abs(dy) > 0) {
            direction = dy > 0 ? 'down' : 'up';
        }

        if (direction) {
            this.scene.moveEnemySquad(direction);
            return NodeState.SUCCESS;
        }

        return NodeState.FAILURE;
    }
}
