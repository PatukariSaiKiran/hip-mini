import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
//Onpush is good for resuable UI componets:
//Component updates only when inputs change or events happen.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {

  /**
   * how it works:
   * parent page passes a placeholder text.
   * User types into input
   * we emit value back to parent using ebventEmitter
   * 
   * Imp: we dont call backend here
   * this component only emits the search text.
   * parent decides what to do (store update, API call).
   *  */ 

  //Input from parent: placeholder shown inside input

  @Input() placeholder = 'Search...';


  // Input from parent: -intial value shown in input
  // useful when parent wants to keep search text in sync with store state

 @Input() value = '';

 //output to parent: 
 //emits whenever user types

 //parent will do: (search) = "onsearch($event)"

 @Output() search = new EventEmitter<string>();

// called on each input event (every keyStroke).
//we emit the latest text to parent.

onInput(value: string): void {
  this.search.emit(value);
}

clear(): void {
  this.value = '';
  this.search.emit('');
}
}
