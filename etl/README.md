# Python ETL 개발 환경

공공데이터의 원본 엑셀을 추출·정제하기 위한 작업 공간입니다. 현재는 환경 확인용 진입점만 제공하며, 데이터를 읽거나 적재하지 않습니다.

Python 3.13을 권장합니다. 아래 명령어는 프로젝트 루트의 Windows PowerShell에서 실행합니다.

```powershell
python -m venv etl/.venv
./etl/.venv/Scripts/python.exe -m pip install -r etl/requirements.txt
./etl/.venv/Scripts/python.exe etl/src/main.py
```

가상환경의 Python을 직접 호출하므로 PowerShell 실행 정책을 변경할 필요가 없습니다. 선택적으로 현재 터미널에서만 활성화할 수 있습니다.

```powershell
./etl/.venv/Scripts/Activate.ps1
python etl/src/main.py
deactivate
```

활성화가 실행 정책으로 차단되면 첫 번째 방법을 사용하세요. macOS/Linux에서는 `etl/.venv/bin/python`으로 바꾸어 실행합니다.

- `src/`: 향후 추출·변환·검증 코드를 둘 위치
- `requirements.txt`: 현재는 외부 의존성이 없습니다. 입력 형식이 확정되면 필요한 패키지와 버전을 추가합니다.
- `../data/raw/`: 원본 엑셀 등, 원본을 수정하지 않고 보관
- `../data/processed/`: 정제 결과 CSV 등

가상환경과 두 데이터 폴더의 실제 파일은 Git에서 제외됩니다. 대용량 파일을 다른 소스 폴더에 저장하지 마세요. 파일 공유 위치와 데이터 출처·다운로드 날짜·이용 조건은 팀 문서에 기록합니다.

다음 단계는 원본 컬럼 분석, 컬럼 매핑 및 결측값·중복·지역명·종목명 처리 규칙 합의입니다. ERD와 규칙 확정 후에만 실제 정제 및 적재 로직을 구현합니다.
