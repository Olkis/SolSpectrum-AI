# SolSpectrum Backend (Fastify + TypeScript)

This is the backend skeleton for **SolSpectrum AI**, covering **Step 1 (server foundation)** and **Step 2 (Helius WebSocket stream)**.

## Quick start
```bash
cd solspectrum-backend
npm install
cp .env.example .env   # then put your HELIUS_API_KEY
npm run dev
```

- HTTP health check: `GET http://localhost:3001/health`
- WebSocket: connect to `ws://localhost:3001` (echo server for now)
- On startup, the server connects to **Helius Enhanced WebSocket** and subscribes to **Jupiter v6 program** transactions. Incoming payloads are logged and also broadcast to connected WS clients under `{ type: "helius.tx", data: ... }`.

## Scripts
- `npm run dev` — ts-node-dev with auto-reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server

## Files
- `src/server.ts` — Fastify HTTP + WS server
- `src/heliusService.ts` — Helius WebSocket connector with auto-reconnect + ping

## Environment
- `PORT` — HTTP port (default 3001)
- `HELIUS_API_KEY` — your Helius API key

## Notes
- The Helius connection uses `wss://atlas-mainnet.helius-rpc.com/?api-key=...` and `transactionSubscribe` with `accountInclude` filter for Jupiter v6 program ID.
- Keep the process running (PM2, systemd, Docker) in production.