import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { apiLimiter, inputSizeLimiter } from './middleware/security';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database manager
const { dbManager } = require('./config/database');

// Test database connections on startup
async function initializeDatabaseConnections() {
  console.log('🔄 Testing database connections...');
  
  const healthCheck = await dbManager.healthCheck();
  const connectionResults = Object.entries(healthCheck);
  
  for (const [userType, isConnected] of connectionResults) {
    if (isConnected) {
      console.log(`✅ Database connection successful for ${userType}`);
    } else {
      console.log(`⚠️  Database connection failed for ${userType}, will retry on first request`);
    }
  }
  
  const connectedCount = connectionResults.filter(([_, connected]) => connected).length;
  console.log(`📊 Database status: ${connectedCount}/${connectionResults.length} connections ready`);
  
  return connectedCount > 0; // Return true if at least one connection is working
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:5173',
      'https://localhost:5173',
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow WebContainer preview URLs (they typically contain specific patterns)
    if (origin && (
      origin.includes('.webcontainer.io') || 
      origin.includes('.stackblitz.io') ||
      origin.includes('bolt.new') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    )) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token']
}));

// Rate limiting
app.use(apiLimiter);

// Input size limiting
app.use(inputSizeLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  const basicHealth = {
    success: true,
    message: 'Talk-to-My-Lawyer API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.json(basicHealth);
});

// Database health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    const healthCheck = await dbManager.healthCheck();
    const allConnected = Object.values(healthCheck).every(Boolean);
    
    res.status(allConnected ? 200 : 503).json({
      success: allConnected,
      message: allConnected ? 'All database connections healthy' : 'Some database connections failing',
      connections: healthCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  // Handle specific error types
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Something went wrong',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    await dbManager.closeAll();
    console.log('Database connections closed.');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  try {
    await dbManager.closeAll();
    console.log('Database connections closed.');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  process.exit(0);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`
🚀 Talk-to-My-Lawyer API Server running on port ${PORT}
📍 Environment: ${process.env.NODE_ENV || 'development'} 
🌐 Server listening on: http://0.0.0.0:${PORT}
🌐 Local access: http://localhost:${PORT}
📧 SMTP configured: ${process.env.SMTP_HOST ? '✅' : '❌'}
🗄️  Database: Checking connections...
⏰ Server started at: ${new Date().toISOString()}
  `);
  
  // Initialize database connections after server starts
  try {
    const dbInitialized = await initializeDatabaseConnections();
    console.log(`🗄️  Database initialization: ${dbInitialized ? '✅ Ready' : '⚠️  Partial'}`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
});

// Handle server startup errors
server.on('error', (error: any) => {
  console.error('❌ Server failed to start:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  }
  process.exit(1);
});

// Log successful server startup
server.on('listening', () => {
  const addr = server.address();
  console.log(`🎉 Server successfully started and listening on ${typeof addr === 'string' ? addr : `${addr?.address}:${addr?.port}`}`);
});
export default app;