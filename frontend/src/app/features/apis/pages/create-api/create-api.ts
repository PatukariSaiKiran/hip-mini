import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';

import { Env, Environment } from '../../../../core/services/env';
import { Api } from '../../services/api';
import { CreateApiPayload, CreateApiResponse } from '../../../../core/models/create-api.model';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../../shared/ui/confirm-dialog/confirm-dialog.service';


type Visibility = 'INTERNAL' | 'PUBLIC';
type Criticality = 'LOW' | 'MEDIUM' | 'HIGH';


@Component({
  selector: 'app-create-api',
  standalone: false,
  templateUrl: './create-api.html',
  styleUrl: './create-api.scss',
})
export class CreateApi implements OnInit, OnDestroy {
// control button + show "Saving..." text
loading = false;

//user feedback messages
error = '';
success = '';
createdApiId = '';
currentStep = 1;
totalSteps = 4;

//dropdown values (must match backend enum);
//declaring class property
envOptions: Environment[] = [];

private subs = new Subscription();
constructor( 
  private envService: Env,
  private apiService: Api,
  private router: Router,
  private cdr: ChangeDetectorRef,
  private confirm: ConfirmDialogService,

) {}

  ngOnInit(): void {
    this.envOptions = this.envService.ENV_OPTIONS;
    // load dropdown options from one shared place.

    this.form.controls.environment.setValue(this.envService.getEnv())
    //set default env to current app env selected in header.
    

    /**
     * Purpose: keep form env synced if user changes ENV in header later
     * Why:
     * - Header env changes should reflect across all pages
     * - Prevent mismatch like header DEV but Create API still TEST
     */

    this.subs.add(
      this.envService.env$.subscribe((e) => {
        this.form.controls.environment.setValue(e);
        this.cdr.markForCheck();
      })
    )
  }

  ngOnDestroy(): void {
    //prevent memory leaks in long-running apps
    this.subs.unsubscribe();
  }

  /** Creates form object
   * purpose of reactive form 
   * Strong control of validation and form state in typescript
   * scales well for large forms + multi-step forms
   * easy to test and maintain
   */
 form = new FormGroup({
  /**
   * apiId field:
   * -nonNullable: true => value is always string (never null)
   * Validators.required => field must not be empty
   * Validators.pattern => forces consistent ID format used across systems
   */
/**
 * required cannot be empty
 * minLength(3): at least 3 characters
 */

//step-1 basics
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  }),

  summaryId: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  }),

  environment: new FormControl<Environment>('DEV', {
    nonNullable: true,
    validators: [Validators.required],
  }),

  version: new FormControl('v1', {
    nonNullable: true,
    validators: [Validators.required],
  }),
  //step 2 - Technical

  description: new FormControl('', { nonNullable: true }),
  basePath: new FormControl('', { nonNullable: true }),
  //  user types "orders,tracking" -> we convert to array
  tags: new FormControl('', { nonNullable: true }),

    // Step 3 – Governance (metadata)
    ownerTeam: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  
    contactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  
    visibility: new FormControl<Visibility>('INTERNAL', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  
    criticality: new FormControl<Criticality>('MEDIUM', {
      nonNullable: true,
      validators: [Validators.required],
    }),  
 })

 nextStep(): void {
  if(!this.isStepValid()){
    this.form.markAllAsTouched();
    this.error = 'please complete required fields before continuing.';
    this.cdr.markForCheck();
    return;
  }
  this.error = '';

  if (this.currentStep < this.totalSteps) {
    this.currentStep++;
    this.cdr.markForCheck();
  }
}
prevStep(): void {
  // here go back one step (no validation need)
  this.error = '';

  if (this.currentStep > 1) {
    this.currentStep--;
    this.cdr.markForCheck();
  }
 
}

isStepValid(): boolean {
  if (this.currentStep === 1) {
    return (
      this.form.controls.name.valid &&
      this.form.controls.summaryId.valid &&
      this.form.controls.environment.valid &&
      this.form.controls.version.valid
    );
  }
  if (this.currentStep === 3) {
    return (
      this.form.controls.ownerTeam.valid &&
      this.form.controls.contactEmail.valid &&
      this.form.controls.visibility.valid &&
      this.form.controls.criticality.valid
    );
  }
  return true;
}

 // Ui


// void: i used void when a amethod is used for UI actions like button clicks, navigation, or triggering service calls, where no return value is required.
// if your just doing an action -> use void
submit(): void {
  this.error = '';
  this.success = '';
  this.createdApiId = '';

  if(this.form.invalid){
    this.error = 'Please fill all required fields correctly.';
    this.cdr.markForCheck();
    return;
    // someone else needs the result use return
// return : I use return when another part of the application needs the result producedd by the method.
  }
  this.loading = true;

  const tagsArray = this.form.controls.tags.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const payload: CreateApiPayload = {
    name: this.form.controls.name.value.trim(),
    summaryId: this.form.controls.summaryId.value.trim(),
    environment: this.form.controls.environment.value,
    version: this.form.controls.version.value.trim(),
    description: this.form.controls.description.value.trim(),
    basePath: this.form.controls.basePath.value.trim(),
    tags: tagsArray,

    metadata: {
      ownerTeam: this.form.controls.ownerTeam.value,
      contactEmail: this.form.controls.contactEmail.value,
      visibility: this.form.controls.visibility.value,
      criticality: this.form.controls.criticality.value,
    },
  };
  this.apiService.createApi(payload).pipe(finalize(() => {
    this.loading = false;
    this.cdr.markForCheck();
  })
).subscribe({
  next: (res: CreateApiResponse) => {
    this.createdApiId = res.api.apiId;

    this.success = `API created as DRAFT. API ID: ${this.createdApiId}`;

    //
    this.form.reset({
      name: '',
      summaryId: '',
      environment: this.envService.getEnv(),
      version: 'v1',
      description: '',
      basePath: '',
      tags: '',
      ownerTeam: '',
      contactEmail: '',
      visibility: 'INTERNAL',
      criticality: 'MEDIUM',

    });
   this.currentStep = 1;
    this.cdr.markForCheck();

  },
  error: (err) => {
    if (err?.status === 409) {
      this.error = 'Duplicate API. Please try again.';
    } else if (err?.status === 401 || err?.status === 403) {
      this.error = 'You are not authorized. please login again.';
    } else if (err?.status === 0) {
      this.error = 'Backend is not reachable. Please check server.';
    } else {
      this.error = err?.error?.message || 'Failed to create API. Try again.';
      
    }
    this.cdr.markForCheck();
  },
});
}

copyApiId(): void {
  if (!this.createdApiId) {
    return;
  }

  navigator.clipboard.writeText(this.createdApiId).then(() => {
    this.success = 'API ID copied to clipboard.';
    this.cdr.markForCheck();

    //autto remove mesage after 2 sec
    setTimeout(() => {
      this.success = '';
      this.cdr.markForCheck();
    }, 2000);
  })
  .catch(() => {
    this.error = 'Copy failed. Please copy manually.';
    this.cdr.markForCheck();
  });
}

cancel(): void {
  console.log('Cancel clicked'); // <-- this must print immediately on click

  const hasChanges = this.form.dirty || this.currentStep !== 1;

  // If nothing changed, just navigate
  if (!hasChanges) {
    console.log('No changes, navigating...');
    this.router.navigate(['/app/manage-apis']);
    return;
  }

  console.log('Opening confirm dialog...');

  this.confirm
    .open({
      title: 'Discard changes?',
      message: 'You have unsaved changes. Do you want to discard them?',
      confirmText: 'Yes, discard',
      cancelText: 'No',
      danger: true,
      closeOnBackdropClick: true,
    })
    .subscribe((ok) => {
      console.log(' Dialog result:', ok); // <-- prints only after user clicks inside dialog

      if (!ok) return;

      // reset UI + form
      this.form.reset({
        name: '',
        summaryId: '',
        environment: this.envService.getEnv(),
        version: 'v1',
        description: '',
        basePath: '',
        tags: '',
        ownerTeam: '',
        contactEmail: '',
        visibility: 'INTERNAL',
        criticality: 'MEDIUM',
      });

      this.currentStep = 1;
      this.router.navigate(['/app/manage-apis']);
      this.cdr.markForCheck();
    });
}

}
