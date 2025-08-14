export const NodeState = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    RUNNING: 'RUNNING',
};

/**
 * 모든 행동 노드의 기본 클래스.
 */
export class Node {
    /**
     * @param {Blackboard} blackboard 공유 정보 저장소
     */
    constructor(blackboard) {
        this.blackboard = blackboard;
    }

    /**
     * 노드가 수행할 로직을 정의합니다.
     * @returns {NodeState}
     */
    execute() {
        throw new Error('Execute method must be implemented in concrete nodes');
    }
}
