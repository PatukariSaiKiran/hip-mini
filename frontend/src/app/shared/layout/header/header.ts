import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AuthUser } from '../../../core/models/auth.model';
import { Env, Environment } from '../../../core/services/env';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  //Purpose : env dropdown options (must match backend enum)
  envOptions: Environment[] = ['DEV', 'TEST', 'PROD'];

  // Purpose: currently selected env for dropdown
  env: Environment = 'DEV';

  /**
   * Purpose:
   * - user = null => public header (Login/Signup)
   * - user! = null => private header (EnV/USER/role/Logout)
   * 
   */

  user: AuthUser | null = null;
  //simple flag for template conditions
  isLoggedIn = false;

  constructor(
    private auth: Auth,
    private envService: Env,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // load persisted env (default DEV)
    this.env = this.envService.getEnv();

    /**
     * keep header reactive with auth state
     * - Login/ Register: auth service sets session -> emits user
     * - Logout: clears session -> emits null
     * user$ is a behaviourSubject
     * it emits: user object after login/register
     * null after logout
     * header listen once and reacts forever
     */ 
    this.auth.user$.subscribe((u: AuthUser | null) => 
    {
      this.user = u;
      this.isLoggedIn = !!u;
      // needed foe me because UI updates somtimes require manual check
      this.cdr.markForCheck();
    });
  }
onEnvChange(value: string): void {
  const env = value  as Environment;  // convert string -> Env type
  this.env = env; // update local env (UI)
  this.envService.setEnv(env); // store env globally in EnvService
  this.cdr.markForCheck(); // Notify Angular to update UI
}
logout(): void {
  this.auth.logout();
  this.router.navigate(['/']);
}
goToLogin(): void {
  this.router.navigate(['/login']);

}
goToRegister(): void {
  this.router.navigate(['/register']);
}
onBrandClick(): void {
  if ( this.isLoggedIn ) {
    // Enterprise default landing after login
    this.router.navigate(['/app/manage-apis']);
  } else {
    //public landing page
    this.router.navigate(['/']);
  }
}
}
