<<<<<<< Updated upstream
// src/heliusService.ts
=======
>>>>>>> Stashed changes
import WebSocket from 'ws';

export type HeliusMessage = any;

/**
<<<<<<< Updated upstream
 * Connect to Helius Enhanced WebSocket and subscribe to Jupiter v6 program transactions.
 * Auto-reconnect with exponential backoff and keep-alive pings.
 */
export function connectToHelius(apiKey: string, onTx?: (msg: HeliusMessage) => void) {
  const WS_URL = `wss://atlas-mainnet.helius-rpc.com/?api-key=${apiKey}`;
=======
 * Connect to Helius WebSocket and subscribe to Jupiter v6 program transactions.
 * Uses Authorization header instead of query string to avoid 401.
 */
export function connectToHelius(apiKey: string, onTx?: (msg: HeliusMessage) => void) {
  const WS_URL = 'wss://mainnet.helius-rpc.com';
>>>>>>> Stashed changes
  const JUP_V6_PROGRAM_ID = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';

  let ws: WebSocket | null = null;
  let pingInterval: NodeJS.Timeout | null = null;
  let reconnectAttempts = 0;

  const subscribe = () => {
    if (!ws) return;
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'transactionSubscribe',
      params: [
        { failed: false, accountInclude: [JUP_V6_PROGRAM_ID] },
        {
          commitment: 'confirmed',
          encoding: 'jsonParsed',
          transactionDetails: 'full',
          maxSupportedTransactionVersion: 0
        }
      ]
    };
    ws.send(JSON.stringify(request));
  };

  const cleanup = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    if (ws) {
      try { ws.terminate(); } catch {}
      ws = null;
    }
  };

  const open = () => {
<<<<<<< Updated upstream
    ws = new WebSocket(WS_URL);
=======
    ws = new WebSocket(WS_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
>>>>>>> Stashed changes

    ws.on('open', () => {
      console.log('Connected to Helius WebSocket');
      reconnectAttempts = 0;
      subscribe();
<<<<<<< Updated upstream
      // keep-alive ping every 10s per Helius guidance
=======

      // keep-alive ping каждые 10 секунд
>>>>>>> Stashed changes
      pingInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) ws.ping();
      }, 10_000);
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString('utf8'));
        onTx?.(message);
<<<<<<< Updated upstream
        // Also log to stdout for Step 2 verification
        console.log('Helius message:', JSON.stringify(message));
=======
>>>>>>> Stashed changes
      } catch (e) {
        console.error('Failed to parse Helius message', e);
      }
    });

    ws.on('error', (err) => {
      console.error('Helius WebSocket error:', err);
    });

    ws.on('close', () => {
      console.log('Helius WebSocket closed. Reconnecting...');
      cleanup();
<<<<<<< Updated upstream
      const delay = Math.min(30_000, 1_000 * (2 ** reconnectAttempts));
=======
      const delay = Math.min(30_000, 1000 * (2 ** reconnectAttempts));
>>>>>>> Stashed changes
      reconnectAttempts += 1;
      setTimeout(open, delay);
    });
  };

  open();
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
