/**
 * 간단한 키-값 저장소로 AI 노드 간 정보를 공유합니다.
 */
export class Blackboard {
    constructor() {
        this.data = new Map();
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        this.data.set(key, value);
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        return this.data.get(key);
    }
}
