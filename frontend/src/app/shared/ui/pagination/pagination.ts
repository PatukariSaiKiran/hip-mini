import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
/** Total number of records in backend (from API response) */
@Input() total = 0;

/** Current page number (1-based) */
@Input() page = 1;

/** Page size */
@Input() limit = 10;

/**
 * Optional: allow parent to show a limit dropdown.
 * If you don’t want it, keep false.
 */
@Input() showLimit = true;

/** Allowed page sizes */
@Input() limitOptions: number[] = [10, 20, 50];

/** Emits page number when user changes page */
@Output() pageChange = new EventEmitter<number>();

/** Emits limit when user changes page size */
@Output() limitChange = new EventEmitter<number>();

/**
 * totalPages is derived from total + limit
 * WHY:
 * - Pagination UI must know how many pages exist
 */
get totalPages(): number {
  if (this.limit <= 0) return 1;
  return Math.max(1, Math.ceil(this.total / this.limit));
}

/** Disable previous button if already on first page */
get isFirst(): boolean {
  return this.page <= 1;
}
/** Disable next button if already on last page */
get isLast(): boolean {
  return this.page >= this.totalPages;
}

goPrev(): void {
  if (this.isFirst) return;
  this.pageChange.emit(this.page - 1);
}

goNext(): void {
  if (this.isLast) return;
  this.pageChange.emit(this.page + 1);
}

goTo(page: number): void {
  const safe = Math.min(this.totalPages, Math.max(1, page));
  if (safe === this.page) return;
  this.pageChange.emit(safe);
}

onLimitSelect(limit: number): void {
  this.limitChange.emit(limit);
}

/**
 * Helper: shows "Showing 11–20 of 57"
 * This is common in enterprise tables.
 */
get rangeText(): string {
  if (this.total === 0) return 'Showing 0 of 0';

  const start = (this.page - 1) * this.limit + 1;
  const end = Math.min(this.total, this.page * this.limit);

  return `Showing ${start}–${end} of ${this.total}`;
}

/**
 * Optional: page number buttons (simple)
 * For now we show max 5 buttons around current page.
 */
get pageButtons(): number[] {
  const total = this.totalPages;
  const current = this.page;

  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);

  const buttons: number[] = [];
  for (let i = start; i <= end; i++) buttons.push(i);

  return buttons;
}

}
