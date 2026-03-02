/**
 * FILE: data-table.ts
 *
 * PURPOSE:
 * Reusable enterprise table grid (DataTable).
 * - Parent passes columns + rows
 * - Table renders grid
 * - Table emits action clicks back to parent
 *
 * IMPORTANT:
 * - This component is ONLY UI
 * - No backend calls here
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

export interface DataTableColumn {
  key: string; // which row property to show (example: 'name', 'summaryId')
  label: string; // header title (example: 'Name')
  type?: 'text' | 'tags' | 'date' | 'status';
  width?: string; // optional fixed width like '220px'
}

export interface DataTableAction<T = any> {
  id: string; // 'view' | 'approve' | 'reject'
  label: string; // tooltip/aria label
  danger?: boolean; // true -> show as red action (reject/delete)
  /**
   * showWhen:
   * - optional function from parent to control visibility per row
   * - example: show approve/reject only when row.status === 'DRAFT'
   */
  showWhen?: (row: T) => boolean;
}

export interface DataTableActionEvent<T = any> {
  actionId: string;
  row: T;
}

@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T = any> {
  /** columns config from parent */
  @Input() columns: DataTableColumn[] = [];

  /** row data from parent */
  @Input() rows: T[] = [];

  /** loading state */
  @Input() loading = false;

  /** error message from parent (optional) */
  @Input() error = '';

  /** empty message when rows are empty */
  @Input() emptyMessage = 'No records found';

  /** actions column config */
  @Input() actions: DataTableAction<T>[] = [];

  /** emits action click to parent */
  @Output() actionClick = new EventEmitter<DataTableActionEvent<T>>();

  getCellValue(row: T, key: string): any {
    return (row as any)?.[key];
  }

  safeText(value: any): string {
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
  }

  isActionVisible(action: DataTableAction<T>, row: T): boolean {
    if (!action.showWhen) return true;
    return action.showWhen(row);
  }

  onAction(actionId: string, row: T): void {
    this.actionClick.emit({ actionId, row });
  }

  /**
   * Render helper for tags:
   * - backend gives tags array
   * - show max 2 tags + "+N" indicator
   */
  getTags(value: any): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter(Boolean);
  }

  /**
   * Render helper for date:
   * - backend gives ISO string
   * - show readable date
   */
  formatDate(value: any): string {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return '-';
      return d.toLocaleString(); // simple readable format
    } catch {
      return '-';
    }
  }
}
