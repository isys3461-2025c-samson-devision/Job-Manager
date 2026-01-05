import { NotificationConsumer } from './kafka/consumer';
import { NotificationService } from './service';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

class NotificationApplication {
  private consumer: NotificationConsumer;
  private notificationService: NotificationService;
  private app = express();
  private port = process.env.PORT || 3003;

  constructor() {
    this.setupExpress();
    this.notificationService = new NotificationService();
    this.consumer = new NotificationConsumer(
      {
        clientId: 'notification-service',
        brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
        ssl: process.env.KAFKA_SSL === 'true',
      },
      'notification-service-group',
      this.notificationService
    );
  }

  private setupExpress(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());

    // Metrics endpoint
    this.app.get('/metrics', async (req, res) => {
      const metrics = await this.consumer.getMetrics();
      res.json(metrics);
    });
  }

  async start(): Promise<void> {
    try {
      console.log('Starting Notification Service...');
      
      // Start Kafka consumer
      await this.consumer.start();
      
      // Start HTTP server
      this.app.listen(this.port, () => {
        console.log(`Notification Service running on port ${this.port}`);
      });
      
      this.setupGracefulShutdown();
      
    } catch (error) {
      console.error('Failed to start Notification Service:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, shutting down gracefully...`);
        await this.consumer.shutdown();
        console.log('Notification Service shut down gracefully');
        process.exit(0);
      });
    });
  }
}

// Start the application
const app = new NotificationApplication();
app.start();