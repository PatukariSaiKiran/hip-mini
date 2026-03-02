import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
//router used to navigate when clicking menu items
//NavigatuinEnd is for emitted after navigation finishes, Used to detect current route, this is how we know which mwnu item is active.
import { filter } from 'rxjs/operators'; // removes all other noise
import { Auth } from '../../../core/services/auth';
import { AuthUser } from '../../../core/models/auth.model';
import { Env, Environment } from '../../../core/services/env';



@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  isCollapsed = false;

  isOpen = true;
  //controls wheather dashboard menu is open or closed.

  user: AuthUser | null = null;
  // Stores logged-in User, why needed to : check role , show ADMIN menus

  env: Environment = 'DEV';

  currentUrl = '';

  constructor(
    private auth: Auth,
    private envService: Env,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * ngOnInit
   * Runs ONCE when component loads
   * Coreect place for initialization logic
   */

  ngOnInit(): void {

    // react to login / logout
    this.auth.user$.subscribe((u) => {
      this.user = u;
      this.cdr.markForCheck();
    });
    // set intial route (page referesh case)
    this.currentUrl = this.router.url;

    // track route changes for active menu highlight
    this.router.events.pipe(
      filter(
        (event): event is NavigationEnd => 
          event instanceof NavigationEnd
      )
    )
    .subscribe((event) => {
      this.currentUrl = event.urlAfterRedirects;
      this.cdr.markForCheck();
    });

    // clean helper for ADMIN-only menus, keeps template readable

   
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN'
  }

  /** expand / collapse DashBoard menu
   * 
   */

  toggleDashboard(): void {
    this.isOpen = !this.isOpen;
    this.cdr.markForCheck();
  }

  // central navigation handler, Avoids router logic in template
  go(path: string): void {
    this.router.navigate([path]);
  }

  // determines which menu item is active
  //supports nested routes(details pages)
  isActive(path: string): boolean {
    return (
      this.currentUrl === path ||
      this.currentUrl.startsWith(path + '/')
    );
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.isOpen = false;
    }
  
    this.cdr.markForCheck();
  }
}
