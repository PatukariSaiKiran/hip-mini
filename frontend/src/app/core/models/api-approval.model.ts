//**
// keep backend response shapes in one place (strong typing)
//so ComponentFactoryResolver.services dont guess fields or use 'any.
//when backend changes, we update oly this file
//  */

/**
 * api stuatus values used by backend for APIs
 */
export type ApiStatus = 'DRAFT' | 'ACTIVE' | 'REJECTED' | 'DELETED';

export type AppEnvironment = 'DEV' | 'TEST' | 'PROD';

export interface ApiMetadata {
    ownerTeam?: string;
    contactEmail?: string;
    visibility?: 'INTERNAL' | 'PUBLIC' | 'PARTNER';
    criticality?: 'LOW'| 'MEDIUM' | 'HIGH';
}

export interface ApiApprovelApi {
    _id: string;
    apiId: string;
    name: string;
    summaryId: string;
    version: string;
    description?: string;
    basePath: string;
    tags: string[];

    metadata?: ApiMetadata;
    environment: AppEnvironment;
    status: ApiStatus;

    createdBy: string;
    updatedBy: string;

    createdAt: string;
    updatedAt: string;

    __v?: number;
}
/**
 * Common paginated response (enterprise pattern).
 * Why:
 * - Approvals list needs pagination and table.
 * - Backend often returns: items + page + total + totalPages etc.
 *
 * We keep it generic so later we can reuse it for:
 * - Manage APIs
 * - Subscriptions list
 * - Users list
 */

export interface PaginationResponse<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiApprovalsQuery {
    search: string;
    status: 'ALL' | ApiStatus;
    page: number;
    limit: number;
}

export const DEFAULT_API_APPROVALS_QUERY:  ApiApprovalsQuery = {
    search: '',
    status: 'DRAFT',
    page: 1,
    limit: 10,
}
