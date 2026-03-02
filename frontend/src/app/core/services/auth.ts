import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Env } from './env';
import { 
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserRole
 } from '../models/auth.model';


@Injectable({
  providedIn: 'root',
})

export class Auth {

  private readonly TOKEN_KEY = 'hip_token';
  private readonly USER_KEY  = 'hip_user';
  private readonly baseUrl  = environment.apiBaserUrl;


  /**
   * 
   * purpose: store latest user in memory.
   * BehaviourSubject gives the latest value immediately to new subscribers.
   */
private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());

// purpose : expose as read-only stream to components (header/sidebar).
readonly user$ = this.userSubject.asObservable(); 

  constructor(private http: HttpClient, private envService: Env) {}

  login(email: string, password: string): Observable<LoginResponse>{
    const body: LoginRequest = {email, password}
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`,body);
  }
  
  register(name: string, email:string, password: string): Observable<RegisterResponse> {
    const body: RegisterRequest = {name, email,password};
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`,body);
  }


  /* ============ SESSION MANAGEMENT ============  */
  /** purpose: save token + user to localstorage and update in-memory subject.
   * Called after successful login/register.
   */

  setSession(token: string, user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  // purpose : used by interceptor to attach Authorization header.
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  // used by guards and layouts to check seesion quickly.

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  //get current user snapshot (useful for guards).
  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }
  //quick role helpers for UI decisions.
  getCurrentRole(): UserRole | null {
    return this.userSubject.value?.role ?? null;
  }

  /** 
   * purpose: clear storage and notify app that user looged out
   * after this, guards will block private routes.
   * 
   */
  logout(): void{
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.envService.reset();
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  
}
