# 초기 개발 환경 구축 결과

검증일: 2026-11-23 (Asia/Seoul)

작업 경로는 `C:\sports-facility-hub`입니다. 처음 확인한 폴더는 비어 있었고 Git 저장소도 없었습니다. 사용자가 확인한 원격 `https://github.com/pcasfs/sports-facility-hub.git`도 커밋이 없는 상태여서 기존 코드를 삭제하거나 덮어쓰지 않고 구성했습니다.

로컬 브랜치는 `codex/setup-environment`이고 `origin`을 연결했습니다. 커밋·push·PR 생성은 수행하지 않았습니다.

## 사용 환경과 주요 패키지

| 항목 | 검증 버전 |
| --- | --- |
| Node.js / npm | 22.14.0 / 11.1.0 |
| React / React DOM | 19.3.1 |
| TypeScript | 5.9.3 |
| Vite / React 플러그인 | 8.3.8 / 6.3.0 |
| ESLint / typescript-eslint | 10.15.0 / 8.73.0 |
| Express / cors | 5.3.0 / 2.8.6 |
| dotenv / mysql2 / tsx | 18.0.10 / 3.24.6 / 4.23.15 |
| MySQL | Docker 이미지 `mysql:8.0`, 실제 서버 8.0.46 |
| Docker / Compose | 29.2.1 / 5.1.0 |
| Python | 3.13.1, 외부 패키지 없음 |

필요한 React·Node·Express·CORS 타입 패키지와 ESLint 관련 개발 패키지도 설치했습니다. 전체 의존성 버전은 루트 `package-lock.json`에 기록되어 있습니다.

처음 활성화된 Node 22.12.0은 최신 린트 의존성의 지원 범위보다 낮아, nvm에 이미 설치되어 있던 22.14.0으로 전환했습니다. 새 터미널에서도 `node --version`으로 확인할 수 있습니다.

## 검증 결과

| 검증 항목 | 결과 / 확인 내용 |
| --- | --- |
| 프론트엔드·백엔드 의존성 설치 | 성공. 루트 workspace 설치와 `npm ci --no-fund` 재설치 |
| 프론트엔드 빌드 | 성공. TypeScript 검사 후 `frontend/dist` 생성 |
| 백엔드 빌드 | 성공. `backend/dist` 생성 |
| ESLint | 성공. `npm run lint` |
| 의존성 검사 | 성공. npm audit 취약점 0건 |
| 프론트엔드 개발 서버 | 성공. `npm run dev`, HTML 및 TSX 모듈 HTTP 200 |
| React 실제 화면 | 성공. 브라우저에서 `Sports Facility Hub` 제목과 한국어 소개 표시 |
| 백엔드 개발 실행 | 성공. `npm run dev`로 두 헬스체크 HTTP 200 |
| 백엔드 빌드 결과 실행 | 성공. `npm start`로 실행 및 API 응답 확인 |
| `GET /api/health` | 성공. HTTP 200 및 요청한 정확한 JSON |
| `GET /api/health/db` 정상 | 성공. 실제 Docker MySQL 연결 후 HTTP 200 |
| `GET /api/health/db` 장애 | 성공. 접속 불가 포트와 실제 MySQL 중지 시 HTTP 503, 내부 오류·비밀번호 미노출 |
| DB 중지 시 API 생존 확인 | 성공. DB 장애 중에도 `/api/health` HTTP 200 |
| CORS / 잘못된 JSON / 없는 경로 | 성공. 지정 origin 응답 헤더 / HTTP 400 / HTTP 404 |
| Compose 설정 | 성공. 실제 `.env`와 `.env.example` 각각 `config --quiet` |
| MySQL 시작·healthcheck | 성공. `docker compose up -d --wait`, 상태 healthy |
| DB 이름·문자셋·정렬 규칙 | `sports_facility_hub`, `utf8mb4`, `utf8mb4_0900_ai_ci` 확인 |
| 데이터 Volume | named volume `sports-facility-hub_mysql_data`가 `/var/lib/mysql`에 마운트됨 |
| DB 재시작·정상 종료 | 같은 volume으로 컨테이너 재생성 후 healthy, 30초 종료 유예 적용 후 ExitCode 0 |
| 테이블·공공데이터 | `SHOW TABLES` 결과 0개. 임의 테이블 생성·데이터 적재 없음 |
| Python 환경 | 성공. `etl/.venv` 생성, 빈 의존성 설치, `etl/src/main.py` 실행 |
| Git 제외 규칙 | 성공. 비밀 환경파일·node_modules·dist·venv·캐시·원본/정제 데이터 제외 |
| 환경변수 예시와 빈 폴더 | 성공. 예시 3개와 `.gitkeep`이 Git 추가 대상에 포함됨 |
| 비밀정보 검사 | 성공. Git 추가 대상 파일에 로컬 생성 비밀번호가 포함되지 않음 |
| README 명령 구문 | PowerShell 코드 블록 17개 구문 검사 통과 |

미해결 실패 또는 환경 제약으로 남은 필수 검증 항목은 없습니다. 첫 Docker 이미지 다운로드의 DNS 오류는 재시도로 해결됐습니다. 중간 의존성 조정에서 발생했던 엔진 경고와 개발 의존성 보안 경고는 Node 전환 및 최종 패키지 조합으로 해결했습니다. 최초 DB 정지에서 종료 코드 137이 확인되어 종료 유예를 30초로 설정했고, 재시작·정상 종료(코드 0)를 다시 확인했습니다.

검증 후 프론트엔드·백엔드 개발 프로세스와 MySQL 컨테이너를 종료했습니다. MySQL volume은 보존되어 있으며 Docker Desktop은 실행 상태로 남겨 두었습니다.

## 실행 명령

이 컴퓨터에는 로컬 `.env` 3개와 가상환경이 이미 준비되어 있습니다. 루트와 백엔드 비밀번호는 일치하는 임의 값이며 Git에서 제외됩니다. 다른 팀원은 루트 README에 따라 각자 `.env`를 만들고 비밀번호를 설정합니다.

프로젝트 루트의 Windows PowerShell에서 실행합니다.

```powershell
Set-Location C:\sports-facility-hub
docker compose up -d --wait
npm run dev:backend
```

다른 터미널에서 프론트엔드를 실행합니다.

```powershell
Set-Location C:\sports-facility-hub
npm run dev:frontend
```

빌드·확인 명령은 다음과 같습니다.

```powershell
npm run build
npm run lint
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/health/db
./etl/.venv/Scripts/python.exe etl/src/main.py
```

## 남아 있는 설정과 다음 개발 단계

1. 소스를 검토하고 최초 커밋·원격 push·기본 브랜치 설정을 완료합니다. 이후 팀원은 clone과 `npm ci`로 동일한 의존성을 설치합니다.
2. 팀원별 로컬 `.env`의 앱 비밀번호를 루트와 백엔드에 동일하게 설정합니다. 비밀번호를 GitHub로 공유하지 않습니다.
3. 원본 데이터 출처·컬럼·품질을 분석하고 요구사항, 함수 종속성, 정규화 근거, ERD를 확정합니다.
4. 합의한 ERD를 바탕으로 `schema.sql`, 검증 SQL, ETL 규칙, API 명세를 작성합니다.

## 생성 파일 목록

모든 소스·설정·문서는 신규 생성입니다. 아래 목록은 Git 추가 대상이며 설치 산출물과 비밀 파일은 제외합니다.

```text
.env.example
.gitattributes
.gitignore
README.md
backend/.env.example
backend/package.json
backend/src/app.ts
backend/src/config/database.ts
backend/src/config/env.ts
backend/src/controllers/health.controller.ts
backend/src/index.ts
backend/src/middleware/error.middleware.ts
backend/src/repositories/health.repository.ts
backend/src/routes/health.routes.ts
backend/src/services/health.service.ts
backend/tsconfig.json
compose.yaml
data/processed/.gitkeep
data/raw/.gitkeep
database/migrations/.gitkeep
database/queries/.gitkeep
database/schema.sql
docs/api/.gitkeep
docs/erd/.gitkeep
docs/setup-verification.md
etl/README.md
etl/requirements.txt
etl/src/main.py
frontend/.env.example
frontend/eslint.config.js
frontend/index.html
frontend/package.json
frontend/src/App.tsx
frontend/src/config/api.ts
frontend/src/main.tsx
frontend/src/styles.css
frontend/src/vite-env.d.ts
frontend/tsconfig.json
frontend/vite.config.ts
package-lock.json
package.json
```
