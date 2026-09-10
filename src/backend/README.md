# Backend — Ocean Subsurface Temperature Reconstruction Pipeline

Node.js / Express / MongoDB backend supporting an end-to-end pipeline that:

1. **Ingests** raw satellite & ocean surface datasets (SST, SSS, SSHA, chlorophyll, wind stress) from sources like INSAT-3D, OCEANSAT, MODIS.
2. **Embeds** surface observations into latent ocean representations via a satellite embedding engine.
3. **Reconstructs** subsurface temperature profiles with a deep learning model, at a standardized **daily, 0.25° grid**.
4. **Validates** reconstructions against independent **ARGO float** observations (RMSE, MAE, bias, correlation — overall and per-depth).
5. Demonstrates a working **PoC over the Bay of Bengal / Arabian Sea**.

The actual embedding/reconstruction neural network is expected to live in a separate Python service (e.g. FastAPI). This backend owns auth, data storage, orchestration, querying, and validation, and talks to that model service over HTTP — with a deterministic **mock fallback** so the API and frontend are fully usable before the model service exists.

## Folder structure

```
backend/
├── server.js                  # entry point
├── src/
│   ├── app.js                 # express app (middleware, routes)
│   ├── config/
│   │   ├── env.js             # centralized env vars
│   │   └── db.js              # mongoose connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Dataset.js         # raw/preprocessed satellite datasets
│   │   ├── Job.js             # pipeline job tracking
│   │   ├── EmbeddingRecord.js # latent embeddings per grid cell/date
│   │   ├── Reconstruction.js  # subsurface temp profiles per grid cell/date
│   │   ├── ArgoObservation.js # ground-truth ARGO float profiles
│   │   └── ValidationResult.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + role authorize
│   │   ├── errorHandler.js
│   │   ├── validate.js
│   │   └── upload.js          # multer for raw file uploads
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   ├── mlService.js       # Python model HTTP client + mock fallback
│   │   └── argoValidationService.js  # matching + statistics
│   └── utils/
│       ├── gridUtils.js       # 0.25° grid math, haversine matching
│       ├── tokens.js
│       ├── logger.js
│       └── apiResponse.js
└── scripts/
    └── seedAdmin.js
```

## Setup

```bash
cd backend
cp .env.example .env      # then edit secrets/URIs
npm install
npm run seed:admin        # creates the first admin user
npm run dev                # nodemon, http://localhost:5000/api
```

Requires a running MongoDB instance (local or Atlas) — set `MONGO_URI` accordingly.

## Auth

JWT access tokens (short-lived, sent in `Authorization: Bearer <token>`) + a refresh token stored as an httpOnly cookie. Roles: `admin`, `researcher`, `viewer`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account (researcher/viewer) |
| POST | `/api/auth/login` | Login, returns access token + sets refresh cookie |
| POST | `/api/auth/refresh` | Exchange refresh cookie for new access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| GET | `/api/auth/me` | Current user (auth required) |

## Datasets

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/datasets` | List (filter by source/variable/status) |
| GET | `/api/datasets/:id` | Get one |
| POST | `/api/datasets` | Upload raw dataset (multipart, field `file`) + metadata |
| PATCH | `/api/datasets/:id/status` | Update processing status |
| DELETE | `/api/datasets/:id` | Admin only |

## Pipeline jobs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List jobs (filter by type/status) |
| GET | `/api/jobs/:id` | Get one job |
| POST | `/api/jobs/preprocessing` | `{ datasetId }` — mark dataset preprocessed |
| POST | `/api/jobs/embedding` | `{ date, region?, resolutionDeg? }` — generate + store embeddings |
| POST | `/api/jobs/reconstruction` | `{ date, region?, resolutionDeg? }` — run model, store subsurface profiles |
| POST | `/api/jobs/validation` | `{ modelVersion, start, end, region?, matchToleranceKm? }` — validate vs ARGO |

## Reconstruction data (for map/chart UI)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reconstructions/grid?date=YYYY-MM-DD&depth=100` | Full grid for a date (optionally at one depth) for a heatmap layer |
| GET | `/api/reconstructions/timeseries?lat=&lon=&start=&end=&depth=` | Time series at one point |

## ARGO observations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/argo` | List (filter by date range / bbox / floatId) |
| POST | `/api/argo` | Create one profile |
| POST | `/api/argo/bulk` | Bulk import parsed ARGO profiles |
| DELETE | `/api/argo/:id` | Admin only |

## Validation results

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/validations` | List past validation runs |
| GET | `/api/validations/:id` | One result (overall + per-depth RMSE/MAE/bias/correlation) |

## Wiring in your real Python model

Replace the mock in `src/services/mlService.js` by standing up a service (FastAPI recommended) at `ML_SERVICE_URL` implementing:

- `POST /embed` → `{ modelVersion, embeddings: [{ lat, lon, vector }] }`
- `POST /reconstruct` → `{ modelVersion, results: [{ lat, lon, profile: [{depth, temperature, uncertainty}] }] }`

No other backend code needs to change — jobs automatically use the real service once it's reachable, and fall back to the mock otherwise (useful for frontend dev/demos).

## Notes / next steps

- `startPreprocessing` currently completes synchronously as a placeholder — wire it to your real preprocessing pipeline (queue + worker, or a webhook callback that flips `Job.status`).
- For large-scale grids/time ranges, consider moving `generateGridPoints` calls to batched/streamed processing and adding pagination to `/reconstructions/grid`.
- CORS is restricted to `CLIENT_ORIGIN` (your Vite dev server by default) — update for production domains.
