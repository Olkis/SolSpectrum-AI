import Fastify from 'fastify';
import { WebSocketServer } from 'ws';
import { connectToHelius } from './heliusService';
import * as dotenv from 'dotenv';
<<<<<<< Updated upstream
=======
import axios from 'axios';
>>>>>>> Stashed changes

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3001;
<<<<<<< Updated upstream

// Simple health route
=======
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

if (!HELIUS_API_KEY) {
  console.error('HELIUS_API_KEY is missing in .env');
  process.exit(1);
}

// --- ROUTES ---

// Healthcheck
>>>>>>> Stashed changes
fastify.get('/health', async () => {
  return { status: 'ok' };
});

<<<<<<< Updated upstream
=======
// Wallet profile
fastify.get('/api/wallets/:address', async (request, reply) => {
  try {
    const { address } = request.params as { address: string };

    // 1. Получаем портфолио токенов
    const balancesUrl = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    const { data: balancesResponse } = await axios.post(balancesUrl, {
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: address,
        page: 1,
        limit: 1000
      },
    });

    const portfolio = (balancesResponse.result?.items || [])
      .filter((item: any) => item.token_info)
      .map((item: any) => ({
        ticker: item.token_info.symbol,
        value: 0, // TODO: рассчитать стоимость через цены
        iconUrl: item.content?.links?.image || 'https://picsum.photos/seed/UNKNOWN/48'
      }));

    // 2. PnL пока заглушки
    const pnl7d = Math.random() * 20000 - 5000;
    const pnl30d = pnl7d * 4 + (Math.random() * 50000 - 10000);
    const pnlAllTime = pnl30d * 5 + (Math.random() * 200000 - 50000);
    const winRate = Math.floor(Math.random() * 40) + 50;

    // 3. Формируем ответ
    const walletProfile = {
      address,
      rank: 0,
      smartnessScore: 0,
      traderStyle: 'Не определен',
      pnl7d,
      pnl30d,
      pnlAllTime,
      winRate,
      favoriteTokens: [],
      portfolio,
    };

    reply.send(walletProfile);

  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: "Failed to fetch wallet data" });
  }
});

// --- SERVER START ---
>>>>>>> Stashed changes
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`HTTP server listening on :${PORT}`);

<<<<<<< Updated upstream
    // Attach WebSocket server to the same HTTP server
=======
    // Attach WebSocket server
>>>>>>> Stashed changes
    const wss = new WebSocketServer({ server: fastify.server });

    wss.on('connection', (ws) => {
      fastify.log.info('WS client connected');
      ws.on('message', (message) => {
        fastify.log.info(`WS message: ${message}`);
        ws.send(`Эхо: ${message}`);
      });
      ws.on('close', () => fastify.log.info('WS client disconnected'));
    });

<<<<<<< Updated upstream
    // Connect to Helius (Step 2)
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      fastify.log.error('HELIUS_API_KEY is missing in .env');
      return;
    }

    connectToHelius(apiKey, (payload) => {
      // Log transactions and broadcast to WS clients for quick visual testing
=======
    // Connect to Helius WebSocket
    connectToHelius(HELIUS_API_KEY, (payload) => {
>>>>>>> Stashed changes
      try {
        fastify.log.info({ helius: payload }, 'Helius transaction payload');
        const data = JSON.stringify({ type: 'helius.tx', data: payload });
        wss.clients.forEach((client: any) => {
          if (client.readyState === 1) client.send(data);
        });
      } catch (e) {
        fastify.log.error({ err: e }, 'Failed to broadcast Helius payload');
      }
    });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

<<<<<<< Updated upstream
start();
=======
start();
>>>>>>> Stashed changes
