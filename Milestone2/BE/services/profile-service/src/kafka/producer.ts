import { Kafka, Producer, Partitioners, CompressionTypes } from 'kafkajs';
import { KafkaConfig, KafkaTopics } from '../../../../shared/types';
import { v4 as uuidv4 } from 'uuid';

export interface ProfileEventData {
  authId: string;
  profileId: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue: any;
  }[];
  eventType: 'PROFILE_UPDATED' | 'PROFILE_CREATED';
}

export class KafkaProducer {
  private producer: Producer;
  private isConnected: boolean = false;

  constructor(private config: KafkaConfig) {
    const kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl,
      retry: {
        initialRetryTime: 300,
        retries: 8,
      },
    });

    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected');
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    }
  }

  async publishProfileEvent(eventData: ProfileEventData): Promise<void> {
    await this.connect();

    const event = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      ...eventData,
      metadata: {
        source: 'profile-service',
        version: '1.0',
        correlationId: uuidv4(),
      },
    };

    try {
      const message = {
        topic: KafkaTopics.PROFILE_UPDATED,
        messages: [
          {
            key: event.authId,
            value: JSON.stringify(event),
            headers: {
              'event-type': event.eventType,
              'content-type': 'application/json',
              'source-service': 'profile-service',
            },
          },
        ],
        compression: CompressionTypes.GZIP,
      };

      const result = await this.producer.send(message);
      
      console.log(`Profile event published successfully`, {
        eventId: event.eventId,
        eventType: event.eventType,
        authId: event.authId,
        partition: result[0].partition,
        offset: result[0].baseOffset,
      });

    } catch (error: any) {
      console.error('Failed to publish profile event:', {
        error: error.message,
        authId: event.authId,
        eventType: event.eventType,
      });
      throw new Error(`Kafka publish failed: ${error.message}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.producer.send({
        topic: KafkaTopics.PROFILE_UPDATED,
        messages: [],
      });
      return true;
    } catch {
      return false;
    }
  }
}