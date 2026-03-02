import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogRequest } from './confirm-dialog.model';
import { ConfirmDialogService } from './confirm-dialog.service';
@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog implements OnInit, OnDestroy {
  isOpen = false;
  // Current request being displayed
  req: ConfirmDialogRequest | null = null;

  private sub = new Subscription();

  constructor(
    private dialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    

    this.sub.add(
      this.dialog.requests$.subscribe((r) => {
        console.log(' dialog received request', r);
        this.req = r;
        this.isOpen = true;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();

  }
  confirm(): void {
    if (!this.req) return;

    this.req.resolve(true);
    this.close();
  }

  cancel(): void {
    if (!this.req) return;

    this.req.resolve(false);
    this.close();
  }

  backdropClick(): void {
    if (!this.req) return;

    const closeOnBackdrop = this.req.options.closeOnBackdropClick ?? true;
    if (closeOnBackdrop) {
      this.req.resolve(false);
      this.close();
    }
  }

  private close(): void {
    this.isOpen = false;
    this.req = null;
    this.cdr.markForCheck();
  }
}
