# Implementation status — LIFE OS v0.23

## Added in v0.12 — persisted life-map recovery and timezone resilience
- Added authenticated `GET /life-map/latest`, returning the latest assessment for each of the ten life areas, re-scored and ordered for display. The query is always scoped to the authenticated user's ID.
- Added `getLatestLifeMap()` to the mobile API client. The Map screen now recovers the last saved map when opened without in-memory navigation data, including after a fresh app launch.
- Added `safeTimeZone()` so invalid or missing stored IANA timezone values fall back to `Europe/Lisbon` rather than causing Today, action-list, or check-in endpoints to fail.
- Added tests for valid, missing and invalid stored timezone values.

## Retained from v0.11 — integration and calendar correctness
- Added a reusable IANA-time-zone calendar-day helper in `apps/api/src/common/local-day.ts`.
- Check-in reads/writes, `GET /actions/today`, and `/today` now calculate day boundaries in the user's configured time zone (defaults to `Europe/Lisbon`) instead of relying on the server's local time zone.
- Calendar boundaries account for daylight-saving changes, so a local day can correctly span 23, 24, or 25 hours.
- Added unit tests for normal days, Lisbon spring-forward and fall-back transitions, and invalid time-zone identifiers.
- Mobile Today now trusts the API's `GET /checkins/latest` result to indicate a current-day check-in, rather than comparing dates in the device's local time zone.
- Prevented duplicate action-result submissions when the action is no longer pending.
- Root scripts now build the scoring package before API compilation and expose workspace test/typecheck commands in a deliberate order.

## Retained from v0.10
- Check-in values are editable and same-day updates target the current day's record.
- Action creation verifies linked goals belong to the authenticated user and are active.
- Goal update accepts only explicitly supported fields.
- Insight refresh removes stale, non-dismissed generated snapshots before writing the current snapshot.

## Validation completed in this environment
- Added v0.13 regression tests for action, goal and memory ownership boundaries; test execution is pending because workspace dependencies are not installed in this environment.
- Performed a TypeScript/TSX syntax-transpilation pass over source and test files after v0.13 changes.
- Compiled the local-day helper in isolation with strict TypeScript.
- Added an authenticated, user-scoped persisted-map retrieval path and performed source-level syntax checks on changed TypeScript/TSX files.
- Executed calendar-boundary assertions for Lisbon: a normal day is 24 hours, 29 March 2026 is 23 hours, and 25 October 2026 is 25 hours; invalid IANA zones are rejected.
- Previous scoring checks remain recorded in v0.10 documentation.
- Attempted `npm install --ignore-scripts --no-audit --no-fund`; it timed out in this environment.

## Validation not completed
- Full semantic type-check of NestJS/Prisma and Expo code is still pending; this environment has no installed workspace dependencies.
- Full workspace build and semantic type-check are not yet verified because dependencies could not be installed.
- API unit tests are committed but could not be run through the workspace test runner without installed `tsx` and other dependencies.
- Prisma client generation, migrations, PostgreSQL-backed integration tests, Expo bundling and device tests remain pending.
- User timezone is currently stored on the account and defaults to `Europe/Lisbon`; a user-facing timezone setting/device-sync flow is still needed for users outside that zone.
- Full multi-user integration tests are still required to prove User A cannot read or mutate User B's goals, actions, results, check-ins, memories or insights.

## Required gate before a real-user pilot
1. Install dependencies in a network-enabled environment and run `npm run build`, `npm test`, and `npm run typecheck`.
2. Generate Prisma client and apply reviewed migrations to a disposable PostgreSQL database.
3. Add integration tests for cross-user access and the full assessment → priority → goal → micro-actions → action result → refreshed insights loop.
4. Add timezone setting/device synchronization and test non-Portugal zones as well as DST boundaries.
5. Complete privacy/security review, data export/deletion, rate limiting, account recovery, backups and production monitoring.


## v0.14 — Multilingual foundation
- 20 language choices in a dedicated screen.
- Detects supported device locale at first launch; user selection is stored via Expo SecureStore.
- Welcome, account, and Today daily-flow strings use the translation hook.
- Translation keys fall back to English then Portuguese where a locale is not complete. This release is a foundation; full localization of every screen and RTL QA are outstanding.
- Validation: syntax transpilation and translation-dictionary integrity checks; no full Expo build was run because dependencies are not installed in this environment.


## v0.15 — Internationalization expansion

Shared screen-copy catalogue integrated into assessment, map, goals, insights, reflection and memory management. Reviewed extended screen translations: pt, en, es, fr, de, zh, ja, ar. Remaining selectable languages fall back to existing localized keys or English. Arabic/Urdu screens apply initial RTL direction; device QA is pending. Privacy copy corrected so it no longer promises account export/deletion before those features exist.

Validation: TypeScript/TSX syntax transpilation only; dependencies absent, so Expo typecheck/build and device-level testing are pending.


## v0.16 — Locale-aware presentation foundation
- Added a shared BCP-47 locale registry for all 20 selectable languages.
- Added locale-aware date, number and percentage formatting with safe fallback behaviour.
- Goal deadlines now use the selected language's date format rather than relying on the device default.
- Centralized right-to-left detection for Arabic and Urdu and reused it across screens that already support directional layout.
- Added localized names for all ten life areas in the remaining 12 selectable languages.
- Important limitation: this is not a claim of full translation of every screen. Existing shared screen copy is reviewed for pt/en/es/fr/de/zh/ja/ar; remaining screens continue to use available localized keys and English fallback. Human linguistic review and RTL/device QA remain necessary.

Validation: standalone locale utility compiled and runtime assertions passed for date/number output, invalid dates and RTL language classification. Full Expo typecheck/build and device tests remain pending because dependencies are not installed in this environment.


## v0.17 — Account privacy controls

Implemented: authenticated data export scoped to the active account; password + email + explicit phrase required for permanent account deletion; mobile account/privacy screen; local session removal after successful deletion; focused controller tests. Export includes profile settings, assessments, goals, actions, action results, check-ins, memories and insights while excluding password hashes.

Not yet verified: full dependency-backed TypeScript type-check, Prisma/PostgreSQL cascade behavior, end-to-end mobile export/share behavior, and actual deletion on a test database. Do not consider production GDPR compliance established by these endpoints alone.


## v0.18 — Privacy and API boundary hardening

Implemented:
- Added `Cache-Control: no-store, private` and `Pragma: no-cache` response headers to the authenticated account-export endpoint.
- Added account-controller tests for authenticated-user scoping across all export queries, excluding password hashes from the profile payload, and rejecting an incorrect destructive-confirmation phrase without querying/deleting the account.
- Replaced unrestricted `app.enableCors()` with an exact-origin allow-list controlled by `CORS_ORIGINS`. Requests without an `Origin` header remain supported for native mobile clients; browser origins not listed are denied CORS access.
- Added a small pure CORS policy helper and tests.

Validation status:
- TypeScript/TSX syntax transpilation and focused pure-helper smoke checks are performed for this ZIP.
- API controller tests are present but require the workspace dependencies to be installed; they have not been represented as passing unless executed in a dependency-enabled environment.
- CORS is only a browser access policy, not authentication or authorization. Configure exact production origins and retain authenticated route-level checks.
- PostgreSQL cascade behavior, full API tests, full mobile build, and device-level tests remain outstanding.


## v0.19 — Exportação móvel como ficheiro

- A vista Conta e Privacidade escreve a resposta da exportação autenticada num ficheiro JSON temporário na sandbox da aplicação e usa a folha nativa de partilha (`expo-sharing`).
- O ficheiro temporário é removido após a partilha ser concluída/cancelada, com remoção idempotente e tolerância a falhas de limpeza.
- Se a partilha nativa não estiver disponível, mantém-se um fallback de partilha de texto.
- Adicionadas dependências Expo FileSystem e Sharing e atualizado o número de versão móvel para 0.19.0.

Limitações de validação: não foi possível instalar dependências nem executar `expo export`, o typecheck completo ou testes em dispositivos. Confirmar versões de módulos com `npx expo install --check`, testar partilha/cancelamento em iOS e Android e rever comportamento de ficheiros temporários antes de uma versão pública.


## v0.20 — regressão de localização e metadados de lançamento

- Alinhadas `apps/mobile/package.json` e `apps/mobile/app.json` na versão `0.20.0`.
- Criados testes para unicidade e cobertura dos 20 idiomas, tags BCP-47, suporte dos formatadores `Intl`, classificação RTL e comportamento seguro com datas inválidas.
- Adicionado `npm run test:locale -w @life-os/mobile`.

Validação específica da entrega: os utilitários de localização e os testes foram compilados isoladamente e executados com Node.js; todos passaram. A sintaxe de todos os ficheiros TS/TSX também foi verificada. A suite completa, build Expo e testes em dispositivos continuam pendentes devido à ausência de dependências instaladas.

## v0.21 — probes de saúde da API e preparação operacional

- Adicionado `GET /health/live`, que indica apenas que o processo da API responde e não depende da base de dados.
- Adicionado `GET /health/ready`, que executa uma consulta trivial à base de dados e devolve estado 503 quando a dependência não está disponível.
- Respostas de falha são sanitizadas: não devolvem mensagens internas, credenciais, connection strings ou detalhes da infraestrutura.
- Adicionados testes unitários para liveness, readiness com base de dados disponível e erro 503 sem fuga de detalhes sensíveis.
- Alinhada a versão da aplicação móvel (`apps/mobile/package.json` e `app.json`) em `0.21.0`.

Utilização operacional: configurar o balanceador/orquestrador para usar `/health/live` como liveness e `/health/ready` como readiness. Estes endpoints não substituem autenticação nos restantes endpoints nem uma monitorização completa. Os testes de controller dependem das dependências NestJS do workspace; nesta entrega, a validação local cobre a sintaxe, a estrutura dos ficheiros, a versão e a integridade do ZIP, mas não equivale a uma execução da suite completa, build Expo ou teste com PostgreSQL real.


## v0.22 — validação robusta da avaliação e da matriz de influência

- `validateAssessments` rejeita ratings não numéricos, não finitos ou fora de 0–10, e exige dez áreas conhecidas sem duplicados.
- `validateDominoMatrix` valida a matriz opcional antes da persistência, rejeitando áreas desconhecidas, auto-influência e pesos não finitos ou fora de 0–5.
- Adicionados testes para casos válidos, dados malformados e a garantia de que uma matriz inválida não provoca gravações.
- Versão móvel e Expo alinhadas em `0.22.0`.

Validação desta entrega: a sintaxe dos ficheiros TS/TSX e a integridade do ZIP são verificadas localmente. Os testes NestJS completos requerem dependências do workspace instaladas; não se afirma que a suite completa ou o teste com PostgreSQL tenham sido executados. Continuam pendentes build integral, typecheck, integração com base de dados e testes em dispositivos.


## v0.23 — End-to-end user-journey regression
- Added `apps/api/test/journey.test.ts`, a stateful in-memory test that invokes the actual LifeMapController, GoalsController, ActionsController and InsightsService in sequence.
- Covers persistence of ten assessment areas, scored life-map output, goal creation, generation of three pending micro-actions, action-result recording, action status transitions, and insight refresh.
- Asserts the generated insights include consistency, action-effect and priority signals, and that generated insights are scoped to the tested user.
- Updated mobile package and Expo app versions to `0.23.0`.

### v0.23 validation completed
- TypeScript/TSX syntax transpilation: 60 files, no syntax diagnostics.
- Journey regression: 1 test passed using actual controllers/services with a stateful in-memory Prisma test double and lightweight stubs for unavailable NestJS/class-validator runtime packages.
- Locale regression: 3 tests passed (20 unique language codes/catalogues/tags, RTL classification, and localized date/number/percent formatting).
- Mobile package and Expo JSON parsed successfully; versions are aligned.
- ZIP integrity check passed.

### v0.23 validation still outstanding
- Full workspace build, semantic typecheck and the complete test suite, because project dependencies are not installed in this environment.
- HTTP-level tests with a real NestJS runtime and PostgreSQL-backed integration tests.
- Full multi-user tests and end-to-end account export/deletion checks against a disposable database.
- Expo bundling and physical-device QA on iOS and Android.


### v0.24 — account deletion integrity

- Fixed a schema inconsistency: the original bootstrap SQL did not cascade user-owned rows on account deletion even though Prisma declared cascades for several models. Existing deployments could reject `DELETE /account` when related rows existed.
- Updated fresh-install SQL and added `db/migrations/20261009_account_deletion_cascade.sql` for existing databases.
- Added an explicit Prisma user relation for `ActionResult` and static schema regression tests.
- Mobile package and Expo version aligned at `0.24.0`.

Validation limitation: static SQL/Prisma checks and syntax checks are useful regression guards, but this migration has not been run against PostgreSQL in this environment. Test it against a backup or disposable database, run Prisma generation and the full test suite, and verify actual cascade behavior before production.

### v0.25 — preflight do contrato de base de dados

- Adicionado `scripts/verify-db-contract.mjs` e o comando de raiz `npm run verify:db-contract` para verificar nove regras de chaves estrangeiras no SQL de instalação, migração e schema Prisma sem instalar dependências.
- A migração de cascata está agora encapsulada em `BEGIN`/`COMMIT`, evitando deixar constraints parcialmente alteradas caso uma instrução falhe.
- Versão móvel e Expo alinhadas em `0.25.0`.

Validação v0.25 executada: `node scripts/verify-db-contract.mjs` passou, verificando as nove regras. Isto é uma verificação estática, não uma integração com PostgreSQL. A migração real, testes completos, typecheck e builds móveis continuam pendentes.

### v0.27 — contratos estáticos de segurança de conta
- Adicionado verificador de contrato para `GET /account/export` e `DELETE /account`, incluindo autenticação, cache privado, allow-list de perfil, exclusão de credenciais, sete consultas de dados com escopo de utilizador, confirmação destrutiva, email/palavra-passe e ID autenticado.
- Adicionados sete testes de regressão, incluindo casos negativos simulados.
- Adicionado `npm run test:contracts` para executar os testes estáticos e os verificadores de base de dados/conta.
- Versões móvel e Expo alinhadas em `0.27.0`.

Limitação: estes testes inspecionam o código-fonte e não substituem testes de execução dos controllers, HTTP ou PostgreSQL. A integração real, build Expo e validação em dispositivos permanecem pendentes.

### v0.29 — primeiro teste PostgreSQL end-to-end

- Adicionado teste de integração opcional que verifica persistência entre clientes Prisma, consultas delimitadas por utilizador e eliminação em cascata de avaliações, objetivos, ações, resultados, check-ins, memórias e insights.
- O CI declara serviço PostgreSQL descartável, executa `prisma db push` nesse serviço e corre `npm run test:postgres`.
- O teste é ignorado quando `DATABASE_URL` não está definido; execução local/CI real ainda é necessária para validar o comportamento do motor PostgreSQL.
- Não representa ainda teste HTTP ponta a ponta dos controladores nem validação de builds móveis.


### v0.30 — autenticação e validação de tokens
- Cobertura de execução adicionada para autenticação por Bearer JWT e fluxos de registo/login.
- Email normalizado com `trim().toLowerCase()` no registo e login.
- `@types/node` declarado explicitamente na workspace para suportar compilação e testes Node.
- Testes cobrem sessão ausente/expirada/inválida, assinatura incorreta, configuração de segredo ausente, palavra-passe incorreta, email duplicado, hash e conteúdo do token.
- A execução completa continua dependente da instalação das dependências; os testes de contrato estáticos são executáveis sem elas.


### v0.30.1 — recuperação da instalação no CI

A configuração do GitHub Actions já não exige um lockfile antes da instalação, aplica retries explícitos ao registo npm e publica o lockfile gerado como artefacto temporário. A falha DNS `EAI_AGAIN` do ambiente local não pode ser corrigida por alterações ao repositório; é necessário executar o CI remoto para verificar a instalação e os testes reais.
