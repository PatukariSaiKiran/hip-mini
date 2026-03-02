import { Environment } from "../services/env";

export interface ApiModel {
    apiId: string;

    name: string;
    summaryId: string;
    version: string;

    description: string;
    basePath: string;
    tags: string[];

    metadata: Record<string, any>;

    environment: Environment;
    status: 'DRAFT' | 'ACTIVE' | 'REJECTED' | 'DELETED';

    createdBy: string;
    updatedBy: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateApiPayload {
    name: string;
    summaryId: string;
    version: string;
    description: string;
    basePath: string;
    tags: string[];
    environment: Environment;
  
    metadata: {
      ownerTeam: string;
      contactEmail: string;
      visibility: 'INTERNAL' | 'PUBLIC';
      criticality: 'LOW' | 'MEDIUM' | 'HIGH';
    };
  }

  export interface CreateApiResponse {
    message: string;
    api: ApiModel;
  }
