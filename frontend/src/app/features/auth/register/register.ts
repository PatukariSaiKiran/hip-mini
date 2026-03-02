import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

constructor(
  private auth: Auth,
  private router: Router,
  private cdr: ChangeDetectorRef

) {}

  // diable button +  show progress text
  loading = false;
  // show backend / validators errors
  error = '';
  // show success feedback before redirect
  success = '';
  /**
   * Purpose: Reactive form for registration
   * - name: required, min length
   * - email: required + format
   * - password: required + min length
   */
  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });


/**
 * Purpose:
 * - Auth Service -> backend calls
 * - Router -> navigation after success
 * - CDR -> manual change detection
 */


//purpose: called when user clicks "create account"

submit() : void {
  this.error = '';
  this.success= '';

  //frontend validation
  if(this.form.invalid) {
    this.error = 'Please fill all fields correctly.';
    this.cdr.markForCheck();
    return;
  }
  //start loading state
  this.loading = true;
  this.cdr.markForCheck();
  
  const name = this.form.controls.name.value.trim();
  const email = this.form.controls.email.value.trim();
  const password = this.form.controls.password.value;

  /**
   * call backend register
   * backend returns token + user (auto-login)
   */
  this.auth
    .register(name, email, password)
    .pipe(
      //always stop loading (success or error)
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    )
    .subscribe({
      next: (res) => {
        //save session (token + user)
        this.auth.setSession(res.token, res.user);

        //show success feedback
        this.success = 'Account created successfully. Redirecting...';
        this.cdr.markForCheck();

        // redirect to private app
        setTimeout(() => {
          this.router.navigate(['/app/manage-apis']);
        },400);
      },
      error: (err) => {
        //Handle common cases cleannly
        if(err?.status === 409) {
          //example : email already exists
          this.error = 'An acount with this email already exists.';
        } else if (err?.status === 0) {
          this.error = 'Backend is not reachable. please check if the server is running.';
        } else {
          this.error = 
             err?.error?.message || ' Registration failed. Please try again.';
        }
        this.cdr.markForCheck();
      }
    })
}






}
