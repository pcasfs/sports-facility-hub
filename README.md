# Sports Facility Hub

공공데이터를 활용하여 전국 공공 체육시설을 지역·운동종목별로 검색하고 시설 상세정보, 공식 예약 사이트, 회원 커뮤니티를 제공하기 위한 5인 팀 프로젝트입니다. 대학교 데이터베이스설계 수업의 목표에 맞춰 ERD, 정규화, 직접 작성한 SQL, 데이터 정제 과정을 함께 관리합니다.

현재 단계는 공통 개발 환경 구축입니다. 기본 React 페이지와 API·DB 헬스체크만 제공하며 시설 검색, 인증, 커뮤니티, 실제 데이터 정제·적재는 아직 구현하지 않았습니다. ORM을 사용하지 않습니다.

초기 구축 시 실행한 검증과 생성 파일 목록은 [구축 결과](docs/setup-verification.md)에 기록되어 있습니다.

## 기술 스택과 필요한 프로그램

| 구분 | 사용 도구 / 권장 버전 |
| --- | --- |
| 프론트엔드 | React 19, TypeScript 5.9, Vite 8, ESLint 10 |
| 백엔드 | Node.js, Express 5, TypeScript 5.9, mysql2/promise |
| Node.js | 22.14 이상인 22.x 또는 24.x LTS. 팀 전체가 같은 LTS 계열의 최신 패치 버전을 사용 |
| npm | 10 이상. 팀에서 같은 버전을 사용하고 루트 잠금 파일을 유지 |
| 데이터베이스 | MySQL 8.0 Docker 이미지. 별도의 MySQL 서버 설치는 불필요 |
| Docker | Windows용 Docker Desktop, WSL 2 기반 Linux containers, Docker Compose v2 이상 |
| ETL | Python 3.13, 표준 라이브러리와 가상환경 |
| 협업 | Git 2.x, GitHub, Pull Request |

Node.js 설치 시 npm을 포함하고 Python 설치 시 PATH 등록을 선택합니다. Docker Desktop을 실행하여 엔진이 준비된 뒤 DB 명령을 실행합니다. WSL 2 또는 가상화 설정이 필요한 경우 Docker Desktop 안내에 따라 준비합니다.

다음 명령과 이후 예시는 **Windows PowerShell** 기준입니다.

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
docker info
python --version
```

PowerShell에서 `npm.ps1` 실행이 차단되면 아래 예시의 `npm`을 `npm.cmd`로 바꿔 실행합니다. 시스템 실행 정책을 변경할 필요가 없습니다.

## 폴더 구조

```text
sports-facility-hub/
├── frontend/
│   ├── src/
│   │   ├── config/api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── eslint.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── queries/
├── etl/
│   ├── src/main.py
│   ├── requirements.txt
│   └── README.md
├── data/
│   ├── raw/
│   └── processed/
├── docs/
│   ├── erd/
│   └── api/
├── .env.example
├── .gitattributes
├── .gitignore
├── compose.yaml
├── package.json
├── package-lock.json
└── README.md
```

루트의 npm workspaces가 `frontend`와 `backend`를 관리합니다. 의존성은 루트에서 설치하며 **루트 `package-lock.json` 하나를 함께 커밋**합니다. 빈 디렉터리는 `.gitkeep`으로 유지합니다.

백엔드의 요청 흐름은 `routes → controllers → services → repositories`입니다. 환경변수·DB 풀은 `config`, HTTP 오류 처리는 `middleware`에 둡니다. SQL은 `repositories`에서 `mysql2/promise`로 직접 실행하며, 외부 입력은 문자열 연결 대신 `?` 매개변수로 전달합니다.

`database/schema.sql`은 ERD 확정 전까지 설명만 유지합니다. `migrations`는 향후 순서가 있는 스키마 변경 SQL, `queries`는 조회·검증 SQL을 관리할 위치입니다. 자동 마이그레이션 실행기는 아직 없습니다. ERD와 API 문서는 각각 `docs/erd`, `docs/api`에 기록합니다.

## 저장소 복제와 의존성 설치

팀 저장소는 [pcasfs/sports-facility-hub](https://github.com/pcasfs/sports-facility-hub)입니다. 처음 참여하는 팀원은 다음과 같이 복제합니다. 이미 복제된 폴더에서는 clone을 다시 실행하지 않습니다.

```powershell
git clone https://github.com/pcasfs/sports-facility-hub.git C:\sports-facility-hub
Set-Location C:\sports-facility-hub
npm ci
```

`npm ci`는 잠금 파일에 기록된 버전으로 두 workspace의 의존성을 함께 설치합니다. 팀원은 개별 폴더에 별도의 잠금 파일을 만들지 않습니다. 새 의존성이 꼭 필요한 경우에만 루트에서 다음과 같이 추가하고 변경된 `package.json`과 루트 `package-lock.json`을 함께 PR에 포함합니다.

```powershell
npm install "패키지명" --workspace frontend
npm install "패키지명" --workspace backend
```

위 두 명령은 사용 예시이며 초기 환경 구축에는 추가 패키지 설치가 필요하지 않습니다.

## 환경변수 설정

프로젝트 루트에서 아래 명령을 실행합니다. 기존 `.env`가 있으면 덮어쓰지 않습니다.

```powershell
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
if (-not (Test-Path -LiteralPath frontend/.env)) {
    Copy-Item -LiteralPath frontend/.env.example -Destination frontend/.env
}
if (-not (Test-Path -LiteralPath backend/.env)) {
    Copy-Item -LiteralPath backend/.env.example -Destination backend/.env
}
```

복사 후 편집기로 값을 설정합니다. 예시의 `replace_with_...` 값은 개인 로컬 개발용 비밀번호로 바꾸고, root 계정과 앱 계정의 비밀번호는 서로 다르게 지정합니다. 실제 비밀번호·API 키는 예시 파일이나 소스 코드에 기록하지 않습니다.

| 파일 | 변수 | 설정과 연결 관계 |
| --- | --- | --- |
| 루트 `.env` | `DB_PORT=3307` | Windows에서 접근할 MySQL 포트. 컨테이너 내부는 3306 |
| 루트 `.env` | `MYSQL_DATABASE=sports_facility_hub` | 개발 DB 이름 |
| 루트 `.env` | `MYSQL_USER=sports_app`, `MYSQL_PASSWORD` | 앱용 계정과 개인 로컬 비밀번호 |
| 루트 `.env` | `MYSQL_ROOT_PASSWORD` | 관리자용 개인 로컬 비밀번호 |
| `backend/.env` | `PORT=3000` | API 서버 포트 |
| `backend/.env` | `CORS_ORIGIN=http://localhost:5173` | 허용할 프론트엔드 origin. 끝에 `/`를 붙이지 않음 |
| `backend/.env` | `DB_HOST=127.0.0.1`, `DB_PORT=3307` | Windows에서 Docker DB로 연결할 주소와 포트 |
| `backend/.env` | `DB_NAME`, `DB_USER`, `DB_PASSWORD` | 루트의 `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`와 각각 일치 |
| `frontend/.env` | `VITE_API_BASE_URL=http://localhost:3000/api` | 프론트엔드가 사용할 API 기본 주소 |

루트 `.env`는 Docker Compose, `backend/.env`는 백엔드, `frontend/.env`는 Vite가 읽습니다. 백엔드는 Docker 안이 아닌 Windows에서 실행하므로 DB 호스트는 `mysql` 대신 `127.0.0.1`입니다. API 포트가 바뀌면 `VITE_API_BASE_URL`, 프론트엔드 주소가 바뀌면 `CORS_ORIGIN`도 맞춥니다.

`VITE_` 변수는 브라우저에 공개되고 빌드 결과에도 포함됩니다. 공개 API 주소만 넣고 DB 비밀번호나 비공개 API 키를 넣지 않습니다. 환경변수 변경 후 개발 서버를 다시 시작하고, 빌드 배포 시에는 다시 빌드합니다. [Vite 환경변수 문서](https://vite.dev/guide/env-and-mode)

`.env`와 `.env.*`는 Git에서 제외되며 `.env.example` 및 `.env.*.example`은 추적할 수 있습니다. 비밀번호에 `$`나 `#` 등 특수문자가 있다면 `.env` 값을 작은따옴표로 감싸 문자 그대로 보존합니다. [Compose 환경변수 문서](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/)

## Docker Compose로 MySQL 실행

Docker Desktop을 실행하고 루트·백엔드 환경변수의 계정 정보를 일치시킨 후 프로젝트 루트에서 실행합니다.

```powershell
docker compose config --quiet
docker compose up -d --wait
docker compose ps
```

`npm run db:up`도 같은 시작 명령을 실행합니다. 이미지 다운로드와 첫 초기화에는 시간이 걸릴 수 있습니다. 설정 구문만 예시 값으로 확인하려면 `docker compose --env-file .env.example config --quiet`를 사용합니다. `config`를 `--quiet` 없이 출력하면 비밀번호가 보일 수 있으므로 결과를 공개하지 않습니다.

DB는 `mysql:8.0`, 문자셋 `utf8mb4`, 정렬 규칙 `utf8mb4_0900_ai_ci`를 사용합니다. named volume `mysql_data`가 DB 파일을 보존하며 포트는 로컬 주소 `127.0.0.1`에만 공개됩니다. Healthcheck는 앱 계정으로 대상 DB에 접속하여 `SELECT 1`을 실행합니다.

접속 정보는 다음과 같습니다. Workbench 등 DB 도구도 같은 정보를 사용합니다.

| 항목 | 기본값 |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `3307` |
| Database | `sports_facility_hub` |
| User | `sports_app` |
| Password | 본인이 루트 `.env`의 `MYSQL_PASSWORD`에 설정한 값 |

MySQL 클라이언트를 별도로 설치하지 않고 컨테이너 안의 클라이언트로 접속할 수도 있습니다. 비밀번호는 프롬프트에 입력합니다. 계정이나 DB 이름을 변경했다면 명령에도 반영합니다.

```powershell
docker compose exec mysql mysql -u sports_app -p sports_facility_hub
```

접속 후 다음 SQL로 상태를 확인하고 `exit`로 나옵니다.

```sql
SELECT VERSION(), DATABASE(), @@character_set_database, @@collation_database;
SHOW TABLES;
```

현재는 테이블이 없는 것이 정상입니다. `schema.sql`을 자동 실행하거나 공공데이터를 적재하지 않습니다.

로그 확인과 종료:

```powershell
docker compose logs --tail 50 mysql
docker compose down
```

`npm run db:down`도 컨테이너를 종료합니다. **`down`은 named volume을 보존**합니다. `down -v`는 DB 데이터까지 삭제하므로 일반 종료 명령으로 사용하지 않습니다.

MySQL 초기 계정·비밀번호·DB 생성 설정은 **빈 volume으로 처음 시작할 때** 적용됩니다. 기존 volume이 있으면 `.env`만 바꿔도 DB 내부 계정이나 비밀번호가 변경되지 않습니다. 이 경우 기존 자격증명을 사용하거나 팀과 합의한 SQL 변경 절차를 따릅니다. [MySQL 공식 Docker 이미지](https://hub.docker.com/_/mysql/)

## 프론트엔드 실행

새 PowerShell 터미널에서 프로젝트 루트로 이동하여 실행합니다.

```powershell
Set-Location C:\sports-facility-hub
npm run dev:frontend
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열면 `Sports Facility Hub`가 표시됩니다. Vite는 5173이 사용 중일 때 임의로 다른 포트를 고르지 않도록 설정되어 있습니다. 종료는 해당 터미널에서 `Ctrl+C`를 누릅니다.

`frontend` 폴더 안에서는 `npm run dev`, `npm run build`, `npm run lint`를 사용할 수 있습니다. 루트에서 프론트엔드만 검사·빌드하려면 다음을 실행합니다.

```powershell
npm run lint
npm run build --workspace frontend
```

결과물은 `frontend/dist`에 생성됩니다. 기본 페이지 이외의 화면과 API 호출 기능은 아직 없습니다. API 주소를 사용하는 후속 코드는 `frontend/src/config/api.ts`를 이용합니다.

## 백엔드 실행

프론트엔드와 별도의 PowerShell 터미널에서 실행합니다.

```powershell
Set-Location C:\sports-facility-hub
npm run dev:backend
```

API는 기본적으로 `http://localhost:3000`에서 실행되며 `tsx watch`가 코드 변경을 감지합니다. `backend/.env`의 필수 변수 `DB_PASSWORD`를 먼저 설정해야 합니다. DB가 중지되어도 API 자체 헬스체크는 응답하고 DB 헬스체크는 실패 상태를 반환합니다.

컴파일 결과로 실행할 때는 개발 서버를 `Ctrl+C`로 종료한 뒤 다음을 실행합니다.

```powershell
npm run build --workspace backend
npm run start:backend
```

`backend` 폴더 안에서는 `npm run dev`, `npm run build`, `npm start`를 사용할 수 있습니다. 컴파일 결과는 `backend/dist`에 생성됩니다. JSON 요청 처리, CORS, 기본 오류 처리, MySQL 연결 풀을 설정해 두었습니다. DB 접근은 ORM 없이 [mysql2/promise](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool)를 사용합니다.

## Python ETL 가상환경 설정

프로젝트 루트에서 실행합니다. 가상환경이 이미 있으면 재생성하지 않습니다.

```powershell
if (-not (Test-Path -LiteralPath etl/.venv)) {
    python -m venv etl/.venv
}
./etl/.venv/Scripts/python.exe --version
./etl/.venv/Scripts/python.exe -m pip install -r etl/requirements.txt
./etl/.venv/Scripts/python.exe etl/src/main.py
```

가상환경의 Python 실행 파일을 직접 사용하므로 활성화나 PowerShell 실행 정책 변경이 필요하지 않습니다. `requirements.txt`에는 아직 외부 패키지가 없습니다. 환경 확인 문구만 출력하며 파일을 읽거나 DB에 적재하지 않습니다.

원본 엑셀은 `data/raw`, 향후 정제 CSV는 `data/processed`에 보관합니다. 두 폴더의 실제 파일, `.venv`, Python 캐시, `node_modules`, `dist`, IDE·OS 임시 파일은 Git에서 제외됩니다. 대용량 데이터는 다른 소스 폴더에 넣지 말고, 공유 위치·출처·다운로드 날짜·이용 조건은 팀 문서에 기록합니다. 상세 설명은 [ETL README](etl/README.md)를 참고합니다.

## API 헬스체크와 빌드 확인

백엔드가 실행 중인 상태에서 별도 PowerShell 터미널을 사용합니다.

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/health
Invoke-RestMethod -Uri http://localhost:3000/api/health/db
```

| API | 성공 | 실패 |
| --- | --- | --- |
| `GET /api/health` | HTTP 200, `status: "ok"`, `message: "Sports Facility Hub API is running"` | 서버가 중지되면 연결할 수 없음 |
| `GET /api/health/db` | HTTP 200, `status: "ok"`, `message: "Database connection is healthy"` | HTTP 503, `status: "error"`, `message: "Database is unavailable"` |

DB 접속 실패의 내부 상세정보나 비밀번호는 API 응답에 포함하지 않습니다. HTTP 상태와 응답을 함께 확인하려면 PowerShell의 별칭 대신 `curl.exe`를 사용합니다.

```powershell
curl.exe -i http://localhost:3000/api/health
curl.exe -i http://localhost:3000/api/health/db
```

전체 빌드와 기본 검증:

```powershell
npm run lint
npm run build
docker compose config --quiet
docker compose ps
./etl/.venv/Scripts/python.exe etl/src/main.py
git status --short
git check-ignore .env frontend/.env backend/.env etl/.venv/pyvenv.cfg
```

`npm run build`는 프론트엔드 타입 검사·Vite 빌드와 백엔드 TypeScript 빌드를 모두 수행합니다. `git check-ignore`는 실제 비밀 파일이 제외되는지 확인하는 명령입니다. 세 `.env.example`은 PR에 포함하고 `.env`는 포함하지 않습니다.

## 자주 발생하는 문제

| 증상 | 확인할 항목 |
| --- | --- |
| Docker 엔진에 연결할 수 없음 | Docker Desktop 실행 여부, Linux containers 및 WSL 2 상태. `docker info`로 확인 |
| MySQL이 unhealthy 또는 API에서 503 | `docker compose ps`, MySQL 로그, 루트·백엔드 계정/비밀번호 일치 여부, 기존 volume의 최초 비밀번호 |
| MySQL 포트 충돌 | 루트와 백엔드 `.env`의 `DB_PORT`를 같은 비어 있는 포트로 변경 후 DB·API 재시작 |
| 프론트엔드 5173 포트 충돌 | 해당 포트를 쓰는 개발 서버를 확인. Vite 포트를 바꾸면 `CORS_ORIGIN`도 변경 |
| API 3000 포트 충돌 | `backend/.env`의 `PORT`와 프론트엔드의 `VITE_API_BASE_URL`을 함께 변경 |
| CORS 오류 | 브라우저 주소와 `CORS_ORIGIN` 일치 여부. `localhost`와 `127.0.0.1`은 서로 다른 origin |
| `npm.ps1` 실행 차단 | `npm.cmd` 사용 |
| `python` 명령을 찾을 수 없음 | Python 설치·PATH 확인 후 터미널 재실행. Python Launcher가 있다면 `py -3.13 -m venv etl/.venv` 사용 |
| 의존성 설치 시 버전 오류 | Node.js 버전과 루트 `package-lock.json` 확인 후 루트에서 `npm ci` 실행 |

## Git 브랜치 및 PR 협업 규칙

원격 저장소가 비어 있다면 이 구성의 최초 커밋과 기본 브랜치 `main` 설정을 팀에서 먼저 완료합니다. 아래 clone·PR 흐름은 소스가 원격 저장소에 반영된 이후를 기준으로 합니다.

1. `main`에는 직접 push하지 않습니다. 최신 `main`에서 작업 브랜치를 만들고 PR로 병합합니다. 초기 환경 구축 브랜치는 `codex/setup-environment`, 이후 팀 작업은 `feat/facility-search`, `docs/erd-v1`, `fix/db-connection`처럼 목적을 드러내는 이름을 사용합니다.
2. PR 하나에는 한 가지 작업 목적을 담습니다. 팀원이 작성한 파일을 삭제·덮어쓰기 전에 변경 목적과 충돌 여부를 확인합니다.
3. PR에는 변경 내용, 실행·검증 방법과 결과, 관련 이슈, 환경변수·DB 변경 여부를 적습니다. 팀원 최소 1명의 검토를 받은 뒤 병합합니다.
4. 패키지를 변경했다면 해당 workspace의 `package.json`과 루트 `package-lock.json`을 함께 커밋합니다. 팀원은 병합 후 `npm ci`로 맞춥니다.
5. DB 변경 PR에는 ERD, 기본키·외래키·제약조건, 정규화 근거, 변경 SQL과 검증 SQL을 함께 검토합니다. 기존 데이터를 수정하거나 삭제하는 SQL은 영향과 실행 순서를 먼저 합의합니다.
6. `.env`, 비밀번호·API 키, 원본 엑셀, 정제 CSV, 가상환경, 빌드 결과는 커밋하지 않습니다. 필요한 변수 이름은 `.env.example`에 플레이스홀더로 추가합니다.

새 작업 예시입니다. 작업 중인 변경이 남아 있으면 다른 브랜치로 전환하기 전에 정리합니다.

```powershell
git switch main
git pull --ff-only
git switch -c feat/facility-search
```

작업 후 빌드·검증을 수행하고 필요한 파일만 선택하여 커밋합니다. 다음은 프론트엔드를 수정했을 때의 예시이며 실제 변경 파일에 맞게 조정합니다.

```powershell
npm run lint
npm run build
git status --short
git add frontend/src
git diff --cached
git commit -m "feat: 시설 검색 기본 구조 추가"
git push -u origin feat/facility-search
```

이후 GitHub에서 `main`을 대상으로 PR을 생성합니다. DB·ETL 변경은 전체 빌드 외에 해당 SQL 또는 Python 실행 결과도 함께 적습니다.

## 다음 개발 단계

먼저 공공데이터의 출처와 컬럼을 분석하고, 시설·지역·운동종목·회원·게시글 등 요구사항과 관계를 팀에서 확정합니다. 함수 종속성과 정규화 근거를 문서화한 뒤 ERD 및 `schema.sql`을 작성합니다. 이후 데이터 품질 규칙과 ETL 흐름, API 명세를 합의하고 시설 검색부터 작은 PR 단위로 구현합니다.
