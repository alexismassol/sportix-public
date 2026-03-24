import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import os from 'os';
import authRoutes from './routes/auth.routes.js';
import statsRoutes from './routes/stats.routes.js';
import eventsRoutes from './routes/events.routes.js';
import userRoutes from './routes/user.routes.js';
import scanRoutes from './routes/scan.routes.js';
import { getDatabase } from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration - autorise localhost et toutes les IPs du réseau local
const isLocalNetwork = (origin) => {
  if (!origin) return false;
  // Autorise localhost et 127.0.0.1
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  // Autorise toutes les IPs 192.168.x.x, 10.x.x.x, 172.16-31.x.x
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    // Vérifie si c'est une IP locale
    const isLocalIP = (
      /^192\.168\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    );
    return isLocalIP;
  } catch {
    return false;
  }
};

app.use(cors({
  origin: true, // Autorise toutes les origines pour le développement
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Initialize database
getDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scan', scanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', version: '1.0.0', name: 'Sportix Public Demo API' } });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route non trouvée' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Erreur serveur interne' });
});

// Detect local network IP for Flutter mobile app configuration
function getLocalIp() {
  try {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  } catch { /* ignore */ }
  return null;
}

// Start server (only if not imported for testing)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();

    console.log(`\n🏟️  Sportix Public Demo API`);
    console.log(`   → http://localhost:${PORT}`);
    if (localIp) {
      console.log(`   → http://${localIp}:${PORT}  (pour Flutter / mobile)`);
    }
    console.log(`   → Environnement: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

export default app;
