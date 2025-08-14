import assert from 'assert';
import { mercenaryEngine } from '../src/game/utils/MercenaryEngine.js';
import { mercenaryData } from '../src/game/data/mercenaries.js';
import { getMBTIString } from '../src/ai/mbtiProfiles.js';
import { classMBTIFilterEngine } from '../src/game/utils/ClassMBTIFilterEngine.js';

const originalRandom = Math.random;
Math.random = () => 0; // 결과를 결정적으로 만듭니다.

// 필터링이 활성화된 상태에서 생성된 메딕은 허용된 MBTI만 가져야 합니다.
classMBTIFilterEngine.enabled = true;
const medic = mercenaryEngine.hireMercenary(mercenaryData.medic);
const medicMbti = getMBTIString(medic);
assert(
    classMBTIFilterEngine.allowedMBTIs.medic.includes(medicMbti),
    `Filtered MBTI mismatch: ${medicMbti}`
);

// 필터링을 비활성화하면 어떤 MBTI든 받을 수 있습니다.
classMBTIFilterEngine.enabled = false;
const medic2 = mercenaryEngine.hireMercenary(mercenaryData.medic);
const medicMbti2 = getMBTIString(medic2);
assert(
    !classMBTIFilterEngine.allowedMBTIs.medic.includes(medicMbti2),
    'Filter disabling failed'
);

// 상태 원복
Math.random = originalRandom;
classMBTIFilterEngine.enabled = true;

console.log('MBTI filtering test passed.');
