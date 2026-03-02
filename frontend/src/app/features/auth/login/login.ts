import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {


// Purpose: show spinner text + disable button while API call is running
loading = false;

// Purpose: store user-friendly error message to show in UI
error = '';
success = '';
/** 
 * Purpose:
 * - AuthService => calls backend
 * - Router => redirect after login success
 */
constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

/**
 * Purpose: Reactive form group (enterprise standard)
 * -nonValuable: true => value is always string (not null)
 * - validators => stops bad request before calling backend
 */
form = new FormGroup({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  }),
});


/**
 * Purpose: called when user submits form.
 * - VAlidate form
 * - Call login API
 * - Save session
 * - Redirect
 */

submit() {
  //Clear previous error on every submit attempt
  this.error = '';
  this.success = '';

  // here If Form is invalid donot call backed
  if(this.form.invalid){
    this.error = 'Please enter a valid email and password.';
    this.cdr.markForCheck();
    return;
  }

  //start loading state
  this.loading = true;



  // Read form values (safe because nonNullable: true)
  const email = this.form.controls.email.value.trim();
  const password = this.form.controls.password.value;

  // Call backend login
console.log('SuBMIT CLICKED');
console.log('Before call loading=',this.loading)
  this.auth
    .login(email, password)
    .pipe(
      //Always stop loading (susscess or error)
      finalize(() => {
        console.log('FINALIZE CALLED')
         this.loading = false;
         this.cdr.markForCheck(); 

      })
    )
    .subscribe({
    next: (res) => {
         // Save token + use in localStorage and update BehaviousSubject
         this.auth.setSession(res.token,res.user);
         this.success = 'Login successful. Redirecting...';
         this.cdr.markForCheck(); 

      // Show success message
      this.success = 'Login successful. Redriecting...';
      //Small dealy so user sees the message
      setTimeout(() => {
        this.router.navigate(['/app/manage-apis']);
      },400);
     
    },
    error: (err) => {
      if (err?.status === 401) {
        this.error = 'Login failed. Invalid email or password.';
      } else if (err?.status === 0) {
        this.error =
          'Backend is not reachable. Please check if the server is running.';
      } else {
        this.error = err?.error?.message || 'Login failed. Please try again.';
      }

      this.cdr.markForCheck(); //   show error text immediately
    },

  });
}



}
