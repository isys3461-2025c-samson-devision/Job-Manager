import { Request, Response } from "express";
import { ProfileService } from "./profileService";
import { createServiceError } from "../../../shared/utils";
import { ProfileResponseDTO } from "./dto/ProfileResponseDTO";
import { BasicTextProfileResponseDTO } from "./dto/BasicTextResponseDTO";
import { UpdateSkillsDTO } from "./dto/UpdateSkillDTO";
import { CreateProfileDTO } from "./dto/CreateProfileDTO";
import { KafkaProducer } from "./kafka/producer";
import { v4 as uuidv4 } from "uuid";

export class ProfileController {
  private profileService = new ProfileService();
  private kafkaProducer: KafkaProducer;

  constructor() {
    this.kafkaProducer = new KafkaProducer({
      clientId: 'profile-service',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
      ssl: process.env.KAFKA_SSL === 'true'
    });
  }

  private async handleKafkaPublishSafely(
    publishFn: () => Promise<void>,
    context: string,
    authId: string
  ): Promise<void> {
    try {
      await publishFn();
    } catch (error: any) {
      console.error(`Kafka publish failed for ${context}:`, {
        authId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private calculateChanges(oldProfile: any, newProfile: any) {
    const changes = [];
    const fieldsToWatch = [
      'name', 'phone', 'address', 'city', 'country', 'birthday', 
      'isPremium', 'skills', 'summary', 'workExperiences', 'education'
    ];
    
    for (const field of fieldsToWatch) {
      const oldValue = oldProfile[field];
      const newValue = newProfile[field];
      
      if (Array.isArray(oldValue) || Array.isArray(newValue)) {
        if (JSON.stringify(oldValue || []) !== JSON.stringify(newValue || [])) {
          changes.push({
            field,
            oldValue: oldValue || [],
            newValue: newValue || [],
          });
        }
      } else if (oldValue !== newValue) {
        changes.push({
          field,
          oldValue,
          newValue,
        });
      }
    }
    return changes;
  }

  createProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;
    
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's profile", 403);
    }
    
    try {
      const profile = await this.profileService.createProfileByAuthId(authId, req.body);
      
      // Publish profile created event (using same topic, different event type)
      await this.handleKafkaPublishSafely(
        () => this.kafkaProducer.publishProfileEvent({
          authId,
          profileId: profile.id,
          changes: [{ field: 'profile_created', newValue: true }],
          eventType: 'PROFILE_CREATED'
        }),
        'createProfile',
        authId
      );
      
      return res.json({ success: true, data: new ProfileResponseDTO(profile) });
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  }

  getProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's profile", 403);
    }

    const profile = await this.profileService.getProfileByAuthId(authId);
    console.log('Fetched profile:', { authId, profileId: profile.id });
    return res.json({ success: true, data: new ProfileResponseDTO(profile) });
  };

  getAllProfile = async (req: Request, res: Response) => {
    const profiles = await this.profileService.getAllProfile();
    const profileDTOs = profiles.map(profile => new ProfileResponseDTO(profile));
    return res.json({ success: true, data: profileDTOs });
  }

  updateProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's profile", 403);
    }
    
    try {
      const currentProfile = await this.profileService.getProfileByAuthId(authId);
      const updatedProfile = await this.profileService.updateProfileByAuthId(authId, req.body);
      
      const changes = this.calculateChanges(currentProfile, updatedProfile);
      
      if (changes.length > 0) {
        await this.handleKafkaPublishSafely(
          () => this.kafkaProducer.publishProfileEvent({
            authId,
            profileId: updatedProfile.id,
            changes,
            eventType: 'PROFILE_UPDATED'
          }),
          'updateProfile',
          authId
        );
      }
      
      return res.json({ 
        success: true, 
        data: new ProfileResponseDTO(updatedProfile)
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  getBasicTextProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;
    
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's basic text profile", 403);
    }

    const basicTextProfile = await this.profileService.getBasicTextProfileByAuthId(authId);
    return res.json({ success: true, data: new ProfileResponseDTO(basicTextProfile) });
  }

  updateBasicTextProfile = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;
    
    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's basic text profile", 403);
    }
    
    try {
      const currentProfile = await this.profileService.getProfileByAuthId(authId);
      
      const basicTextProfile = await this.profileService.updateBasicTextProfileByAuthId(authId, req.body);
      
      // Calculate changes for basic text fields only
      const changes = this.calculateChanges(currentProfile, basicTextProfile);
      
      if (changes.length > 0) {
        await this.handleKafkaPublishSafely(
          () => this.kafkaProducer.publishProfileEvent({
            authId,
            profileId: basicTextProfile.id,
            changes,
            eventType: 'PROFILE_UPDATED'
          }),
          'updateProfile',
          authId
        );
      }
      
      return res.json({ 
        success: true, 
        data: new BasicTextProfileResponseDTO(basicTextProfile)
      });
    } catch (error) {
      console.error('Failed to update basic text profile:', error);
      throw error;
    }
  }

  updateSkills = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot update another user's skills", 403);
    }
    
    try {
      const currentSkills = await this.profileService.getSkillsByAuthId(authId);
      const updateSkillsDTO = new UpdateSkillsDTO(req.body);
      const updatedProfile = await this.profileService.updateSkillsByAuthId(authId, updateSkillsDTO);
      
      const newSkills = updatedProfile.skills || [];
      const oldSkills = currentSkills || [];
      
      const changes = this.calculateChanges(oldSkills, newSkills);
      if (JSON.stringify(oldSkills.sort()) !== JSON.stringify(newSkills.sort())) {
        changes.push({
          field: 'skills',
          oldValue: oldSkills,
          newValue: newSkills,
        });
      }
      
      if (changes.length > 0) {
        await this.handleKafkaPublishSafely(
          () => this.kafkaProducer.publishProfileEvent({
            authId,
            profileId: updatedProfile.id,
            changes,
            eventType: 'PROFILE_UPDATED'
          }),
          'updateSkills',
          authId
        );
      }
      
      return res.json({ 
        success: true, 
        data: {
          skills: updatedProfile.skills,
          count: updatedProfile.skills?.length || 0
        },
        message: 'Skills updated successfully'
      });
    } catch (error) {
      console.error('Failed to update skills:', error);
      throw error;
    }
  };

  getSkills = async (req: Request, res: Response) => {
    const { authId } = req.params;
    const requester = req.user!;

    if (requester.role === "APPLICANT" && requester.userId !== authId) {
      throw createServiceError("Forbidden: Cannot access another user's skills", 403);
    }

    const skills = await this.profileService.getSkillsByAuthId(authId);
    
    return res.json({ 
      success: true, 
      data: {
        skills,
        count: skills.length
      }
    });
  };
}