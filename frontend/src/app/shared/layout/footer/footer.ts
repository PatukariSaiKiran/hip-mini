import { Component } from '@angular/core';
import { Env } from '../../../core/services/env';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
   /**
   * Purpose:
   * - Display current year dynamically
   * - Avoid hardcoding year in template
   */
year = new Date().getFullYear();

version = '1.0';
isLoggedIn = false;

  /**
   * Purpose:
   * - Application version
   * - Useful for debugging, deployments, audits
   * - In real enterprises this often comes from environment.ts
   */
constructor(public envService: Env,
  private auth: Auth

) {
  this.auth.user$.subscribe(user => {
    this.isLoggedIn = !!user;
  })
}



}
