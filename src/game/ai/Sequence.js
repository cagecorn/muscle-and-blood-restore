import { Node, NodeState } from './Node.js';

/**
 * 자식 노드를 순차적으로 실행하는 시퀀스 노드.
 */
export class Sequence extends Node {
    /**
     * @param {Blackboard} blackboard
     * @param {Node[]} children
     */
    constructor(blackboard, children) {
        super(blackboard);
        this.children = children;
    }

    /**
     * @returns {NodeState}
     */
    execute() {
        for (const child of this.children) {
            const result = child.execute();
            if (result !== NodeState.SUCCESS) {
                return result;
            }
        }
        return NodeState.SUCCESS;
    }
}
