class ClassMBTIFilterEngine {
    constructor() {
        // 필터링 기능 활성화 여부 (기본값: 활성화)
        this.enabled = true;
        // 각 클래스별 허용 가능한 MBTI 풀
        this.allowedMBTIs = {
            nanomancer: ['INTP', 'INFP'],
            medic: ['ISFJ', 'INFJ'],
            warrior: ['ESTJ', 'ISTJ'],
            gunner: ['ENFP', 'ENTP'],
            mechanic: ['ENFJ', 'ENTP'],
            sentinel: ['ISTJ', 'ISFJ'],
            hacker: ['ISTP', 'INTP'],
            ghost: ['ISFP', 'INFP'],
            darkKnight: ['ESFP', 'ESTP'],
            paladin: ['ESFJ', 'ENFJ'],
            android: ['INFJ', 'ISFJ'],
            plagueDoctor: ['INFP', 'INFJ'],
            commander: ['ENTJ', 'ESTJ'],
            clown: ['ENTP', 'ENFP'],
            esper: ['INTJ', 'INFJ'],
            flyingmen: ['ESTP', 'ENTP'],
        };
    }

    /**
     * 지정된 클래스에 맞는 MBTI 성향을 생성합니다.
     * @param {string} classId - 용병의 클래스 ID
     * @returns {object|null} - MBTI 성향 점수 객체 또는 null
     */
    generateFor(classId) {
        const pool = this.allowedMBTIs[classId];
        if (!this.enabled || !pool) return null;
        const mbti = pool[Math.floor(Math.random() * pool.length)];
        return this._mbtiStringToTraits(mbti);
    }

    /**
     * MBTI 문자열을 점수 객체로 변환합니다.
     * @param {string} mbti
     * @returns {object}
     */
    _mbtiStringToTraits(mbti) {
        return {
            E: mbti[0] === 'E' ? 75 : 25,
            I: mbti[0] === 'I' ? 75 : 25,
            S: mbti[1] === 'S' ? 75 : 25,
            N: mbti[1] === 'N' ? 75 : 25,
            T: mbti[2] === 'T' ? 75 : 25,
            F: mbti[2] === 'F' ? 75 : 25,
            J: mbti[3] === 'J' ? 75 : 25,
            P: mbti[3] === 'P' ? 75 : 25,
        };
    }
}

export const classMBTIFilterEngine = new ClassMBTIFilterEngine();
