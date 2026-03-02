import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-status-filter',
  standalone: false,
  templateUrl: './status-filter.html',
  styleUrl: './status-filter.scss',
})
export class StatusFilter {

  /**
   * label shown before dropdown
   * Example: "Status"
   */
  @Input() label = 'Status';

  @Input() options: Array<{ label: string; value: string }> = [];

  /**
   * Current selected value (controlled by parent).
   * Parent will pass current store status here.
   */

  @Input() value = 'DRAFT';

  // Emits selected value to parent wen user changes dropdown.

  @Output() valueChange = new EventEmitter<string>();

  onChange(value: string): void {
    this.valueChange.emit(value);
  }
}
