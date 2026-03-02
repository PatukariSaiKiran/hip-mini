import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, switchMap } from 'rxjs'; 

import { ApiApprovelApi } from '../../../../core/models/api-approval.model';
import { ApiApprovalsStore } from '../../state/api-approvals.store';
import { ApprovalService } from '../../services/approval.service';
import { ConfirmDialogService } from '../../../../shared/ui/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-api-approvals',
  standalone: false,
  templateUrl: './api-approvals.html',
  styleUrl: './api-approvals.scss',
})
export class ApiApprovals implements OnInit, OnDestroy {

  //table state

  apis: ApiApprovelApi[] = [];
  total= 0;
  page = 1;
  limit = 10;

  loading = false;
  error = '';


  private subs = new Subscription();

  constructor(
    private store: ApiApprovalsStore,
    private service: ApprovalService,
    private confirm: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}


ngOnInit(): void {
  
  const sub = this.store.query$
   .pipe(
     switchMap(() => {
      this.loading = true;
      this.error = '';
      return this.service.fetchApis();
    })
   )
   .subscribe({
    next: (res) => {
      this.apis = res.items;
      this.total = res.total;
      this.page = res.page;
      this.limit = res.limit;

      this.loading = false;
      this.cdr.markForCheck();
    },
    error: (err) => {
      this.error = err?.error?.message || 'Failed to load approvals';
      this.loading = false;
      this.cdr.markForCheck();
    }
   });

   this.subs.add(sub);
}

ngOnDestroy(): void {
  this.subs.unsubscribe();
}


onSearch(value: string): void {
  this.store.setSearch(value);
}

onStatusChange(status: string): void {
  const allowed = ['ALL', 'DRAFT', 'ACTIVE', 'REJECTED'] as const;

  if (allowed.includes(status as any)) {
    this.store.setStatus(status as 'ALL' | 'DRAFT' | 'ACTIVE' | 'REJECTED');
    return;
  }

  // fallback safety
  this.store.setStatus('DRAFT');
}

onPageChange(page: number):
 void {
  this.store.setPage(page);
}

onLimitChange(limit: number): void {
  this.store.setLimit(limit);
}


approve(api: ApiApprovelApi): void {
  this.confirm.open({
    title: 'Approve API?',
    message: `Are you sure you want to approve ${api.name}?`,
    confirmText: 'Approve',
    cancelText: 'Cancel',
    danger: false
  }).subscribe((ok) => {
    if (!ok) return;
    this.loading = true;

    this.service.approveApi(api.apiId).subscribe({
      next:() => {
        // after approval, we referesh list, instead of manually refetching, we simply trigger store update.
        this.store.setPage(this.page);
      },
      error: () => {
        this.error = 'Failed to approve API';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  });
}

reject(api: ApiApprovelApi): void {
  this.confirm.open({
    title: 'Reject API?',
    message: `Are you sure you want to reject ${api.name}?`,
    confirmText: 'Reject',
    cancelText: 'Cancel',
    danger: true
  }).subscribe((ok) => {
    if (!ok) return;
    this.loading = true;

    this.service.rejectApi(api.apiId, 'Rejected by admin').subscribe({
      next: () => {
        this.store.setPage(this.page); //trigger refresh
      },
      error: () => {
        this.error = 'Failed to reject API';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  });
}
onTableAction(event: { actionId: string; row: ApiApprovelApi }): void {
  const { actionId, row } = event;

  if (actionId === 'view') {
    // Later we will navigate to details page
    console.log('View clicked:', row.apiId);
    return;
  }

  if (actionId === 'approve') {
    this.approve(row);
    return;
  }

  if (actionId === 'reject') {
    this.reject(row);
    return;
  }
}

showDraftOnly = (row: any): boolean => {
  return row?.status === 'DRAFT';
};
}
