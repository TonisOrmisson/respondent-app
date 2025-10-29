# Repository Guidelines

## Project Structure & Module Organization
The workspace is split between `SurveyApp/` (React Native TypeScript client) and `backend/` (PHP 8.1 API). Within `SurveyApp/src/`, folders such as `components/`, `screens/`, `services/`, `store/`, `navigation/`, `types/`, `utils/`, and `__tests__/` keep UI, data, and helpers isolated, while the root `__tests__/` directory holds integration suites. The backend exposes HTTP entry points in `public/` and organizes request handlers, services, and persistence helpers under `src/Handlers`, `src/Services`, and `src/Database`.

## Build, Test, and Development Commands
- Mobile: `cd SurveyApp && npm install`, `npm run start` for Metro, `npm run android` or `npm run ios` to deploy, `npm test` for Jest, and `npm run lint` for ESLint/Prettier checks.
- Backend: `cd backend && composer install`, then `composer start` (or `./start.sh`) to serve the API at `http://localhost:8088`.

## Coding Style & Naming Conventions
TypeScript follows the repo ESLint/Prettier setup (2-space indent, single quotes, semicolons). Components and screens use PascalCase filenames; hooks, helpers, and Zustand slices stay camelCase and end with `Store`. Backend PHP code should follow PSR-12 with four-space indents, one class per file, and namespaces that mirror the `src/**` path. Consolidate shared constants in `SurveyApp/src/types` or `backend/src/Services` instead of duplicating literals.

## Testing Guidelines
Jest with React Native Testing Library drives the existing suite; add `*.test.ts` or `*.test.tsx` files beside the code under the nearest `__tests__/` folder and ensure `npm test` passes before pushing. Regenerate snapshots intentionally with `npm test -- -u`. The backend currently relies on manual verification, so run the `curl` flows documented in `backend/README.md` whenever handlers change and document any new endpoints there.

## Commit & Pull Request Guidelines
Use an imperative summary with an optional scope, e.g. `mobile: add survey retry state` or `backend: tighten otp validation`, and keep the first line under 72 characters. In the body, note the rationale and list the commands you ran. Pull requests should link the relevant task from `tasks/todo.md`, summarize UI or API impacts, attach screenshots or sample responses when behavior changes, and repeat the verification steps you executed.

## Configuration & Security Notes
Point the React Native API base URL in `SurveyApp/src/services/api.ts` at the environment you are targeting. Store backend secrets in `backend/.env` (keep it out of version control) and avoid checking anything sensitive into `backend/storage/`, which is writable at runtime. Rotate sample data and tokens after demos to prevent accidental reuse.
