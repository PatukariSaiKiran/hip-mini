import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


/**
 * Purpose: 
 * - Store selected environemnt (DEV/TEST/PROD) in one global place.
 * Why:
 * -Header changes env
 * - Manage APIs / Subscriptions pages read env to call backend with ?env =
 */

export type Environment = 'DEV' | 'TEST' | 'PROD';


@Injectable({
  providedIn: 'root',
})
export class Env {

  // purpose localStorage key so Environment persists after refresh
  private readonly  KEY = 'hip_env';
  private readonly  DEFAULT_ENV: Environment = 'DEV';
  readonly ENV_OPTIONS: Environment[] = ['DEV', 'TEST', 'PROD'];
  /**
   * BehaviousSubscject Purpose:
   * - Keeps lastest env value in memory
   * - Any component can subscribe and instantly get current env
   */
  private readonly envSubject = new BehaviorSubject<Environment>(this.getStoredEnv());

  //public observable for components (read-only)
  env$ = this.envSubject.asObservable();

  /** set env and notigy all subscribers */
  setEnv(env: Environment): void {
    localStorage.setItem(this.KEY,env);
    this.envSubject.next(env);
  }

  // quick getter for current env
  getEnv(): Environment {
    return this.envSubject.value
  }
  /**
   * read env from localStorage once at startup
   */
  reset(): void {
    localStorage.removeItem(this.KEY);
    this.envSubject.next(this.DEFAULT_ENV);
  }

  /**
   * Purpose: read env from localStorage once at startup
   * - also validates value to avoid broken UI if storage is corrupted
   */
  private getStoredEnv(): Environment {
    const saved = (localStorage.getItem(this.KEY) || '').trim().toUpperCase();

    if (saved === 'DEV' || saved === 'TEST' || saved === 'PROD') {
      return saved as Environment;
    }

    return this.DEFAULT_ENV;
  }
  
}
