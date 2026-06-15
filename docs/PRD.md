# PRD: 화학식량 몰수 질량 비교 저울 GitHub/Vercel 배포 구조화

## 목적

`mole-mass-comparator.html` 단일 파일 앱을 GitHub에 올리고 Vercel에 배포할 수 있는 프론트엔드/백엔드 분리 구조로 정리한다.

## 사용자 목표

- GitHub 업로드가 가능한 표준 프로젝트 구조를 만든다.
- Vercel에서 정적 프론트엔드와 Serverless API 백엔드가 함께 배포되게 한다.
- 기존 수업용 시뮬레이터의 화면과 핵심 동작은 보존한다.
- 테스트와 검수 문서를 남겨 이후 Claude Code 피드백을 반영하기 쉽게 한다.

## 범위

- 프론트엔드: `frontend/index.html`
- 공유 데이터: `shared/substances.json`
- 백엔드: `backend/catalog.js`, `api/catalog.js`, `api/health.js`
- 배포 산출물: `dist/`
- 배포/검수 스크립트: `scripts/`
- 테스트: `tests/`
- 문서: `docs/`

## 비범위

- 로그인, 학생 정보 저장, DB 연동은 추가하지 않는다.
- React/Vite/Next.js 같은 프레임워크는 도입하지 않는다.
- 기존 시뮬레이터의 수업 내용과 UI를 대규모로 재설계하지 않는다.

## 성공 기준

- `npm test`가 통과한다.
- `npm run build`가 `dist/index.html`과 `dist/assets/catalog.js`를 생성한다.
- `/api/health`와 `/api/catalog` 함수가 Node 테스트에서 정상 응답한다.
- Vercel 설정은 `Build Command: npm run build`, `Output Directory: dist`에 맞는다.
- 원본 `mole-mass-comparator.html`은 보존된다.

## 배포 메모

- Vercel Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`
- API Functions: `api/*.js`
