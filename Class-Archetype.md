# 클래스 아키타입 현황

## 1. 구현된 클래스 아키타입
현재 저장소에 정의된 아키타입은 다음과 같습니다.

- Dreadnought
- Frostweaver
- Aquilifer
- Executioner
- Arcane Blade
- Force Major
- Berserker
- Spellbreaker

## 2. 어미-자식 관계
각 아키타입이 속한 상위 클래스는 다음과 같습니다.

- **Warrior**: Dreadnought, Berserker, Spellbreaker
- **Nanomancer**: Frostweaver, Arcane Blade, Force Major
- **Priest**: Aquilifer
- **Rogue**: Executioner
- **Ranger**: (미구현 – 예정된 아키타입: Trapmaster)
- **Necromancer**: (미구현 – 예정된 아키타입: Dreadbringer)

## 3. 자식 아키타입이 부족한 클래스
현재 6개의 상위 클래스 중에서 Warrior와 Nanomancer를 제외한 **4개 클래스**(Priest, Rogue, Ranger, Necromancer)는 자식 아키타입이 0~1개 수준으로 부족합니다.

## 4. 클래스 + MBTI 성향 = 아키타입 로직
- `ArchetypeAssignmentEngine`은 용병의 MBTI 값을 가중치로 계산해 가장 적합한 아키타입을 확률적으로 부여합니다.
- `archetypeTriggers`는 특정 클래스가 특정 MBTI 조합을 가질 때 우선적으로 선택될 아키타입을 정의하지만, 현재 엔진과 직접 연결되지는 않았습니다.
- 두 로직을 조화롭게 사용하려면, 먼저 `archetypeTriggers`로 클래스별 고정 아키타입을 검사한 뒤, 매칭되지 않는 경우에만 `ArchetypeAssignmentEngine`의 가중치 로직을 적용하는 방식이 필요합니다.

