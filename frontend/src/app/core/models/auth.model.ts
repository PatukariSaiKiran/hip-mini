// Purpose: strong typing for auth contract between frontend and backend.

export type UserRole = 'ADMIN' | 'USER';


export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole
}

export interface RegisterResponse {
    message: string;
    token: string;
    user: AuthUser;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    // NOTE: role is intentionally NOT here for security (server decides role)


}
export interface LoginRequest {
    email: string;
    password: string;
}



