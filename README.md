# 화학식량 · 몰수 · 질량 비교 저울

한국어 화학 수업용 정적 시뮬레이터입니다. GitHub 업로드 후 Vercel에서 정적 프론트엔드와 Serverless API를 함께 배포하도록 구조화했습니다.

## 구조

- `frontend/index.html`: 배포용 프론트엔드 진입점
- `shared/substances.json`: 화학식량/상태/밀도 공유 데이터
- `backend/catalog.js`: API에서 쓰는 데이터 헬퍼
- `api/catalog.js`: 물질 데이터 API
- `api/health.js`: 배포 상태 확인 API
- `scripts/build-static.js`: `dist/` 정적 산출물 생성
- `mole-mass-comparator.html`: 원본 단일 HTML 보존본

## 로컬 실행

```powershell
npm test
npm run build
npm run preview
```

미리보기 주소:

```text
http://127.0.0.1:5173/
```

## Vercel 설정

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`
