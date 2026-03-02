import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  constructor(private router: Router, private authService: Auth ) {}

  ngOnInit(): void {
    //If token/ user exists -> already logged in -> go to private area
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/app/manage-apis'])
    }
  }

}
