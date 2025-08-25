import Fastify from 'fastify';
import { WebSocketServer } from 'ws';
import { connectToHelius } from './heliusService';
import * as dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3001;

// Simple health route
fastify.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`HTTP server listening on :${PORT}`);

    // Attach WebSocket server to the same HTTP server
    const wss = new WebSocketServer({ server: fastify.server });

    wss.on('connection', (ws) => {
      fastify.log.info('WS client connected');
      ws.on('message', (message) => {
        fastify.log.info(`WS message: ${message}`);
        ws.send(`Эхо: ${message}`);
      });
      ws.on('close', () => fastify.log.info('WS client disconnected'));
    });

    // Connect to Helius (Step 2)
    const apiKey = process.env.HELIUS_API_KEY;
    if (!apiKey) {
      fastify.log.error('HELIUS_API_KEY is missing in .env');
      return;
    }

    connectToHelius(apiKey, (payload) => {
      // Log transactions and broadcast to WS clients for quick visual testing
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

start();