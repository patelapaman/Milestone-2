# API Testing Checklist

1. `GET /health` returns `status=ok`.
2. `GET /predictions` returns seeded predictions.
3. `GET /anomalies` returns non-normal predictions.
4. `GET /threat-summary` returns KPI and chart-ready aggregates.
5. `GET /model-performance` returns algorithm/evaluation status.
6. `GET /predictions/{event_id}` returns one investigation record.
7. `POST /predict` accepts a security event and persists its result.
8. Swagger at `/docs` can manually execute all endpoints.
