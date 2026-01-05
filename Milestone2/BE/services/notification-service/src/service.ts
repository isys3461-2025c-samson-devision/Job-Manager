import { ProfileEvent } from '../../../shared/types';

export interface Notification {
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  channel: 'email' | 'push' | 'in_app';
  priority: 'low' | 'normal' | 'high';
}

export class NotificationService {
  
  async handleProfileCreated(event: ProfileEvent): Promise<void> {
    const notification: Notification = {
      userId: event.authId,
      type: 'PROFILE_CREATED',
      title: 'Profile Created Successfully',
      body: 'Your profile has been created successfully. Welcome to our platform!',
      data: {
        eventId: event.eventId,
        profileId: event.profileId,
        timestamp: event.timestamp,
      },
      channel: 'in_app',
      priority: 'normal',
    };

    await this.sendNotification(notification);
    
    console.log('Profile creation notification sent:', {
      userId: event.authId,
      eventId: event.eventId,
    });
  }

  async handleProfileUpdated(event: ProfileEvent): Promise<void> {
    const { authId, changes } = event;
    
    // Determine notification type based on changes
    const notificationType = this.determineNotificationType(changes);
    const { title, body } = this.getNotificationContent(changes, notificationType);

    const notification: Notification = {
      userId: authId,
      type: notificationType,
      title,
      body,
      data: {
        eventId: event.eventId,
        profileId: event.profileId,
        changes,
        timestamp: event.timestamp,
      },
      channel: this.getNotificationChannel(notificationType),
      priority: this.getNotificationPriority(notificationType),
    };

    await this.sendNotification(notification);
    
    console.log('Profile update notification sent:', {
      userId: authId,
      type: notificationType,
      eventId: event.eventId,
    });
  }

  private determineNotificationType(changes: any[]): string {
    const changedFields = changes.map(c => c.field);
    
    if (changedFields.includes('email')) return 'EMAIL_CHANGED';
    if (changedFields.includes('phone')) return 'PHONE_CHANGED';
    if (changedFields.includes('skills')) return 'SKILLS_UPDATED';
    if (changedFields.includes('name')) return 'NAME_CHANGED';
    if (changedFields.includes('address') || changedFields.includes('city') || changedFields.includes('country')) {
      return 'LOCATION_CHANGED';
    }
    
    return 'PROFILE_UPDATED';
  }

  private getNotificationContent(changes: any[], type: string): { title: string; body: string } {
    const changedFields = changes.map(c => c.field).join(', ');
    
    const templates: Record<string, { title: string; body: string }> = {
      EMAIL_CHANGED: {
        title: 'Email Updated',
        body: 'Your email address has been successfully updated. Please verify your new email.',
      },
      PHONE_CHANGED: {
        title: 'Phone Number Updated',
        body: 'Your phone number has been updated successfully.',
      },
      SKILLS_UPDATED: {
        title: 'Skills Updated',
        body: `Your skills have been updated. ${changes.find(c => c.field === 'skills')?.newValue.length || 0} skills added/updated.`,
      },
      NAME_CHANGED: {
        title: 'Name Updated',
        body: 'Your profile name has been updated successfully.',
      },
      LOCATION_CHANGED: {
        title: 'Location Updated',
        body: 'Your address information has been updated.',
      },
      PROFILE_UPDATED: {
        title: 'Profile Updated',
        body: `Your profile has been updated. Changed fields: ${changedFields}`,
      },
    };

    return templates[type] || templates.PROFILE_UPDATED;
  }

  private getNotificationChannel(type: string): 'email' | 'push' | 'in_app' {
    const channelMap: Record<string, 'email' | 'push' | 'in_app'> = {
      EMAIL_CHANGED: 'email',
      PHONE_CHANGED: 'email',
      SKILLS_UPDATED: 'in_app',
      NAME_CHANGED: 'in_app',
      LOCATION_CHANGED: 'in_app',
      PROFILE_UPDATED: 'in_app',
    };

    return channelMap[type] || 'in_app';
  }

  private getNotificationPriority(type: string): 'low' | 'normal' | 'high' {
    const priorityMap: Record<string, 'low' | 'normal' | 'high'> = {
      EMAIL_CHANGED: 'high',
      PHONE_CHANGED: 'high',
      SKILLS_UPDATED: 'normal',
      NAME_CHANGED: 'normal',
      LOCATION_CHANGED: 'normal',
      PROFILE_UPDATED: 'low',
    };

    return priorityMap[type] || 'normal';
  }

  private async sendNotification(notification: Notification): Promise<void> {
    // Implement your notification delivery logic here
    console.log('Sending notification:', JSON.stringify(notification, null, 2));

    // Example implementations (uncomment and configure as needed):
    
    // 1. For email notifications
    if (notification.channel === 'email') {
      await this.sendEmailNotification(notification);
    }
    
    // 2. For push notifications (Firebase, APNS)
    if (notification.channel === 'push') {
      await this.sendPushNotification(notification);
    }
    
    // 3. For in-app notifications (store in database)
    if (notification.channel === 'in_app') {
      await this.storeInAppNotification(notification);
    }
  }

  private async sendEmailNotification(notification: Notification): Promise<void> {
    // Implement using Nodemailer, SendGrid, etc.
    console.log(`[EMAIL] To: ${notification.userId}, Subject: ${notification.title}`);
    // Example:
    // await transporter.sendMail({
    //   to: userEmail,
    //   subject: notification.title,
    //   text: notification.body,
    //   html: `<p>${notification.body}</p>`,
    // });
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    // Implement using Firebase Cloud Messaging, APNS, etc.
    console.log(`[PUSH] To: ${notification.userId}, Title: ${notification.title}`);
    // Example:
    // await admin.messaging().send({
    //   token: deviceToken,
    //   notification: {
    //     title: notification.title,
    //     body: notification.body,
    //   },
    //   data: notification.data,
    // });
  }

  private async storeInAppNotification(notification: Notification): Promise<void> {
    // Store in database for in-app notifications
    console.log(`[IN_APP] Storing notification for user: ${notification.userId}`);
    // Example:
    // await prisma.notification.create({
    //   data: {
    //     userId: notification.userId,
    //     type: notification.type,
    //     title: notification.title,
    //     body: notification.body,
    //     data: notification.data,
    //     read: false,
    //     createdAt: new Date(),
    //   },
    // });
  }
}