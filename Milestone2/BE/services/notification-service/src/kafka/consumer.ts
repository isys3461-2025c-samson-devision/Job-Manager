import { Kafka, Consumer, EachMessagePayload, Admin } from 'kafkajs';
import { KafkaConfig, ProfileEvent } from '../../../../shared/types';

export class NotificationConsumer {
  private consumer: Consumer;
  private admin: Admin;
  private isRunning: boolean = false;
  private metrics = {
    messagesProcessed: 0,
    errors: 0,
    lastMessageTime: null as Date | null,
  };

  constructor(
    private config: KafkaConfig,
    private groupId: string,
    private notificationService: any
  ) {
    const kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl,
    });

    this.consumer = kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      heartbeatInterval: 3000,
      maxBytesPerPartition: 1048576,
      readUncommitted: false,
    });

    this.admin = kafka.admin();
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    await this.admin.connect();
    
    // Create topic if it doesn't exist
    await this.ensureTopicExists('profile.updated.v1');
    
    await this.consumer.subscribe({
      topics: ['profile.updated.v1'],
      fromBeginning: false,
    });

    console.log('Kafka consumer connected and subscribed');
  }

  private async ensureTopicExists(topic: string): Promise<void> {
    try {
      const topics = await this.admin.listTopics();
      if (!topics.includes(topic)) {
        await this.admin.createTopics({
          topics: [{
            topic,
            numPartitions: 3,
            replicationFactor: 1,
          }],
        });
        console.log(`Created topic: ${topic}`);
      }
    } catch (error) {
      console.error('Error ensuring topic exists:', error);
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    await this.connect();

    await this.consumer.run({
      autoCommit: true,
      autoCommitInterval: 5000,
      autoCommitThreshold: 100,
      partitionsConsumedConcurrently: 3,

      eachMessage: async (payload: EachMessagePayload) => {
        await this.processMessage(payload);
      },
    });

    this.isRunning = true;
    console.log('Kafka consumer started');
  }

  private async processMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const eventType = message.headers?.['event-type']?.toString() as 'PROFILE_UPDATED' | 'PROFILE_CREATED';

    console.log(`Received message`, {
      topic,
      partition,
      offset: message.offset,
      eventType,
    });

    try {
      if (!message.value) {
        throw new Error('Empty message value');
      }

      const messageStr = message.value.toString();
      const event: ProfileEvent = JSON.parse(messageStr);

      // Validate required fields
      if (!event.authId || !event.profileId) {
        throw new Error('Missing required fields');
      }

      // Process based on event type
      switch (eventType) {
        case 'PROFILE_UPDATED':
          await this.notificationService.handleProfileUpdated(event);
          break;
        case 'PROFILE_CREATED':
          await this.notificationService.handleProfileCreated(event);
          break;
        default:
          console.warn(`Unknown event type: ${eventType}`);
      }

      this.metrics.messagesProcessed++;
      this.metrics.lastMessageTime = new Date();

      console.log(`Successfully processed event`, {
        eventId: event.eventId,
        authId: event.authId,
        eventType,
        partition,
        offset: message.offset,
      });

    } catch (error: any) {
      this.metrics.errors++;
      console.error('Failed to process message:', {
        error: error.message,
        topic,
        partition,
        offset: message.offset,
      });

      // Send to dead letter queue or retry
      await this.handleFailedMessage(payload, error);
    }
  }

  private async handleFailedMessage(payload: EachMessagePayload, error: Error): Promise<void> {
    // Implement retry logic or dead letter queue
    const { topic, partition, message } = payload;
    
    // For now, just log and continue
    console.log('Message moved to error log:', {
      topic,
      partition,
      offset: message.offset,
      error: error.message,
    });
  }

  async stop(): Promise<void> {
    if (this.isRunning) {
      await this.consumer.stop();
      await this.consumer.disconnect();
      await this.admin.disconnect();
      this.isRunning = false;
      console.log('Kafka consumer stopped');
    }
  }

  async shutdown(): Promise<void> {
    await this.stop();
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  async getMetrics(): Promise<any> {
    const consumerGroups = await this.admin.describeGroups([this.groupId]);
    const groupDescription = consumerGroups.groups[0];
    
    return {
      consumer: {
        groupId: this.groupId,
        state: groupDescription.state,
        members: groupDescription.members.length,
      },
      processing: {
        messagesProcessed: this.metrics.messagesProcessed,
        errors: this.metrics.errors,
        lastMessageTime: this.metrics.lastMessageTime,
      },
    };
  }
}