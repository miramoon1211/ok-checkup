# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## 프로젝트 소개

OK금융 업무 점검 — 금융 업무 체크리스트 앱입니다. Lovable로 만들었으며, 구글 계정으로 로그인한 뒤 카테고리별 점검 항목을 체크하고, 메모를 남기고, 진행률을 확인할 수 있습니다.

## 주요 명령어

- `npm run dev` — 개발 서버 실행 (http://localhost:8080)
- `npm run build` — 배포용 빌드
- `npm run lint` — 코드 스타일 검사
- `npm run test` — 테스트 실행 (1회)
- `npm run test:watch` — 테스트 실행 (파일 변경 시 자동 재실행)

## 기술 구조

**사용 기술:** React 18 + TypeScript + Vite + Supabase + TanStack Query + Tailwind CSS + shadcn/ui

**로그인 흐름:** 구글 로그인 → Supabase 세션 생성 → 앱 전체에서 로그인 상태 공유 (`src/hooks/useAuth.tsx`). 로그인 안 되어 있으면 로그인 화면, 로그인 되어 있으면 체크리스트 화면으로 이동합니다.

**데이터 저장:** Supabase 데이터베이스에 `checklist_items` 테이블 하나를 사용합니다. 항목마다 제목, 카테고리, 체크 여부, 메모, 정렬 순서 등을 저장합니다. 처음 로그인하면 기본 점검 항목이 자동으로 생성됩니다 (`src/hooks/useChecklist.ts`).

**화면 구성:** 페이지는 메인(`/`)과 404 페이지 두 개뿐인 단일 페이지 앱입니다.

**상태 관리:** 서버 데이터는 TanStack Query, 로그인 상태는 React Context, 화면 UI 상태는 컴포넌트 내부에서 관리합니다. 메모는 입력 후 0.6초 뒤 자동 저장됩니다.

## 주요 파일

- `src/App.tsx` — 앱의 시작점. 로그인, 라우터, 알림 등 전체 설정
- `src/pages/Index.tsx` — 로그인 여부에 따라 로그인 화면 또는 체크리스트 화면 표시
- `src/components/ChecklistApp.tsx` — 체크리스트 메인 화면. 필터링, 카테고리 관리, 전체 상태 관리
- `src/hooks/useChecklist.ts` — 데이터 조회/수정/삭제/추가 로직, 기본 데이터 생성
- `src/hooks/useAuth.tsx` — 로그인 상태 관리
- `src/integrations/supabase/client.ts` — Supabase 연결 설정
- `src/integrations/supabase/types.ts` — 데이터베이스 타입 정의 (자동 생성)

## 디자인

기본 다크 테마. 색상은 `src/index.css`에서 CSS 변수로 관리합니다. UI 컴포넌트는 shadcn/ui를 사용하며 `src/components/ui/`에 있습니다. 한국어 폰트: Noto Sans KR. 경로 단축: `@` → `./src`.

## 테스트

Vitest + @testing-library/react 사용. 설정 파일: `src/test/setup.ts`. 테스트 파일 위치: `src/**/*.{test,spec}.{ts,tsx}`.
