# 검수 피드백 — mole-mass-comparator.html

- 대상 파일: `mole-mass-comparator.html`
- 검토 회차: **1차**
- 검토일: 2026-06-15
- 검토자: Claude (검수)
- 검토 방식: 정적 코드 리뷰 (화학 데이터 정확성 / 런타임 로직 / 교육적 표현 / 접근성)

> **코덱스에게**: 아래 항목 중 **[필수][권장]** 만 반영하면 됩니다. **[참고]** 는 의도된 설계일 수 있어 수정 불필요. **"검증 완료(정상)"** 목록은 정확하므로 **건드리지 마세요.** 수정 후 변경한 부분을 한 줄씩 적어 회신해 주세요.

---

## 총평
구조·네이밍·상태관리(`app` 객체 중심)가 깔끔하고, 화학식량(M) 값이 IUPAC 표준 원자량과 일치합니다. SVG 시각화와 비교 로직도 정상 동작합니다. **치명적 버그 없음.** 아래는 다듬기 수준의 사항입니다.

---

## [권장] P1. 질량 고정 모드에서 몰수가 `0.00 mol`로 표시되는 경우
- **위치**: `renderStats()` L437 (몰수 카드), `renderCompare()` L454–455 (비교 막대 값), 결론 문장
- **현상**: 질량 고정 모드에서 화학식량이 큰 물질을 작은 질량으로 두면 몰수가 매우 작아짐.
  - 예) 설탕(M 342.30) · 1 g → n = 1/342.30 ≈ **0.0029 mol** → `toFixed(2)` 결과 **`0.00 mol`**.
  - 물질이 분명히 존재하는데 화면엔 `0.00 mol`로 보여 **"몰수=0"이라는 교육적 오해**를 유발.
- **제안**: 몰수 표시에 적응형 소수 자릿수 적용. 예시:
  ```js
  // n 값 포맷 헬퍼 (작은 값일수록 자릿수 ↑)
  const fmtMol = n => n >= 0.1 ? n.toFixed(2) : n.toFixed(3);
  ```
  - 적용 지점: `renderStats()`의 몰수 `.v`, `renderCompare()`의 `bLval`/`bRval`(몰수 단위일 때), 결론 문장의 `mL.n.toFixed(2)` 등.
  - 막대 길이(`barL/barR` width)는 실제 값 기준이라 변경 불필요. **표시 문자열만** 정밀도 개선.

---

## [참고] 의도 확인만 필요 (수정 불필요 가능성 높음)

### N1. 전자저울 LCD 옆 'g' 단위가 투명 처리됨
- **위치**: `balanceBase()` L316 `<text ... opacity=".0">g</text>`
- LCD 숫자 오른쪽 'g'는 `opacity 0`으로 숨겨져 있으나, 같은 LCD 좌하단에 `g · TARE`(L317, opacity .7)가 **이미 단위를 표시**하고 있음 → 의도된 처리로 보임. 단위 인지에 문제 없으면 그대로 두세요.

### N2. 고체의 보조 통계 카드가 '상태'(고체) 반복 표시
- **위치**: `renderStats()` L431 — 액체/기체는 부피를 보여주는데, 고체는 상단에서 이미 알 수 있는 '상태'만 반복.
- 정보량이 적을 뿐 오류는 아님. 의미 있는 값(예: 입자 수 ≈ n × 6.02×10²³)으로 대체할 여지가 있으나 **선택**.

### N3. `metrics()` 중복 호출
- `updateVisual` / `renderStats` / `renderCompare`가 각각 `metrics()`를 재계산. 200줄 규모라 성능 영향 없음 → **유지 권장**(불필요한 추상화 지양).

---

## 검증 완료 (정상 — 수정 금지)
- **화학식량 M (전부 정확)**: NaCl 58.44, C₁₂H₂₂O₁₁ 342.30, C₆H₁₂O₆ 180.16, CaCO₃ 100.09, H₂O 18.02, C₂H₆O 46.07, C₂H₄O₂ 60.05, H₂ 2.02, O₂ 32.00, N₂ 28.01, CO₂ 44.01
- **몰부피** 22.4 L/mol (0 °C·1기압) — 한국 교육과정 관례와 일치
- **밀도** 물 1.000 / 에탄올 0.789 / 아세트산 1.049 g/mL — 약 20 °C 기준 타당
- **핵심 로직**: w = n×M, 몰수고정→질량비교 / 질량고정→몰수비교 분기, `sameM` 동일식량 처리, 결론 비례관계(같은 몰수 → M∝w / 같은 질량 → M∝1/n) — **모두 정확**
- **런타임 안정성**: `DOMContentLoaded` 후 `buildStage`로 SVG 주입 → 이후 `refreshAll`에서 `-lcd/-heap/-fill/-balloon` 참조, 초기화 순서상 null 참조 없음. 상태 전환·셀렉트 변경·리셋 경로 정상.
- **접근성**: `aria-pressed`, `aria-label`, `:focus-visible`, `prefers-reduced-motion` 대응 양호.

---

## 다음 단계
1. 코덱스: **P1** 반영(필요 시 N2 선택 반영) 후 회신.
2. 검수자: 수정본 재검수 → 이 파일에 **2차** 섹션 추가.

---
---

# 2차 검수 (2026-06-15)

## 판정: P1 해결 ✅ · 신규 권장 P2 1건 · 치명 결함 없음

### P1 (몰수 0.00 표시) — 정상 반영 확인
- `fmtMol = n => n >= 0.1 ? n.toFixed(2) : n.toFixed(3)` 추가
  - `mole-mass-comparator.html` L282 / `frontend/index.html` L271 **두 곳 모두**
- 적용 지점 전부 반영: 몰수 카드(`renderStats`), 비교 막대값(몰 단위일 때만), 결론 문장(`verdict`).
  - 참고: 질량고정 `sameM` 분기의 `mL.n.toFixed(2)`는 **몰수고정 모드 슬라이더값(≥0.1)** 이라 0.00 문제 없음 — 정상.
- **회귀 테스트 추가됨**: 두 HTML 각각 "formats very small mole values without rounding to zero".
- `npm test` → **9/9 통과** (node v24).

### 데이터 정합성 — 양호
- `shared/substances.json` 화학식량 11종 **전부 1차 검증값과 일치** (드리프트 없음).
- 아키텍처: **SSOT = `shared/substances.json`**. `backend/catalog.js`가 `require`로 직접 사용, `frontend/index.html`은 빌드 생성 `/assets/catalog.js`(`window.MOLE_MASS_CATALOG`, `Object.freeze`) 로드 → **M값 하드코딩 중복 없음**. 원본 보존본만 자체 임베디드 SUBS 보유(standalone 목적상 정상).

---

## [권장] P2 (신규 — 구조 확장에서 발생) · 시뮬레이션 로직이 두 HTML에 수기 중복
- `frontend/index.html` 과 `mole-mass-comparator.html` 이 ~250줄 JS(`fmtMol`·`metrics`·`render*`·SVG 빌더)를 **각각 보유**.
- `scripts/build-static.js`는 `frontend/index.html`을 **그대로 dist로 복사**(L51–52)할 뿐 원본에서 생성하지 않음.
- 이번 P1도 **두 곳에 각각** 반영해야 했음 → 앞으로 로직 수정 시 한쪽 누락 → **드리프트 위험**.
- 선택지:
  - **(a) 권장** — `frontend/index.html`을 표준 소스로 두고, standalone 원본은 빌드 시 catalog 인라인 주입으로 **생성**해 단일 소스화.
  - (b) "두 HTML은 항상 함께 수정" 규칙을 README/주석에 명시.
  - (c) 오프라인 standalone과 배포본을 **의도적 분리 유지**라면 현행 수용 가능(위험 인지 전제).

---

## 검수자 관찰 (코드 결함 아님 — 사용자 판단 필요)
- 단일 교실용 정적 HTML 1개가 **Vercel serverless API(`api/catalog.js`, `api/health.js`) + 빌드 파이프라인 + 테스트**로 확장됨.
- `docs/PRD.md` · `docs/superpowers/plans/2026-06-15-...md` 계획 문서가 있어 **기획된 작업**으로 보임.
- 다만 교실용 정적 시뮬레이션 목적에는 serverless API가 과할 수 있음(카탈로그는 정적 JSON으로 충분). 의도된 배포 요건이면 현행 유지, 아니면 단순화 검토 권장. → **사용자 결정 사항.**

## 종합
- 요청 수정(P1): **완료·검증됨**. 화학 정확성/테스트/데이터 정합성 모두 양호.
- 다음 작업이 있다면: **P2(로직 중복) 단일 소스화** 또는 현행 분리 유지 결정.
