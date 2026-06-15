# PRD: 센서 CSV 분석기 GitHub/Vercel 배포 구조화

## 목적

`sensor-csv-analyzer (1).html` 단일 파일 앱을 GitHub 업로드와 Vercel 배포에 맞는 프론트엔드/백엔드 분리 구조로 정리한다.

## 사용자 목표

- 기존 센서 CSV 분석기 UI와 로컬 파일 처리 흐름을 보존한다.
- Vercel에서 정적 프론트엔드와 Serverless API가 함께 배포되게 한다.
- CSV 파싱, 시간 정제, 통계 계산을 테스트 가능한 공유 코어로 분리한다.
- Claude Code 피드백 파일이 생기면 읽고 반영한다.
- 최종 결과를 `musicofcity-kr/SENSOR` 저장소에 업로드한다.

## 범위

- 프론트엔드: `frontend/index.html`
- 공유 분석 코어: `shared/analyzer-core.js`
- 백엔드/API: `backend/analyzer-info.js`, `api/health.js`, `api/schema.js`
- 빌드/미리보기: `scripts/build-static.js`, `scripts/serve-static.js`
- 테스트: `tests/`
- 문서: `docs/`, `README.md`

## 비범위

- 학생 로그인, 서버 저장, 데이터베이스 연동은 추가하지 않는다.
- CSV 파일은 서버로 업로드하지 않는다.
- 기존 UI를 프레임워크로 재작성하지 않는다.

## 성공 기준

- `npm test`가 통과한다.
- `npm run build`가 `dist/index.html`과 `dist/assets/analyzer-core.js`를 생성한다.
- `/api/health`, `/api/schema` 핸들러가 테스트에서 정상 응답한다.
- 원본 `sensor-csv-analyzer (1).html`은 보존된다.
- Vercel 설정은 Framework `Other`, Build Command `npm run build`, Output Directory `dist` 기준으로 맞는다.
