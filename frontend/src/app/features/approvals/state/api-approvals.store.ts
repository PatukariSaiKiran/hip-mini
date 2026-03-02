/**
 * this file manages the state of the approvals page list
 * what state?
 * -search text
 * -status filter
 * -current page
 * -page size (limit)
 * 
 * instad of storing these inside the component. we centralize them in a small reactive store.
 * 
 * Why? keeps in sync
 * avoids messy component logic
 * makes code scalable
 */


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiApprovalsQuery, ApiStatus, DEFAULT_API_APPROVALS_QUERY } from '../../../core/models/api-approval.model';

@Injectable({
  providedIn: 'root',
})
export class ApiApprovalsStore {

  /**
   * BeheviourSubject why:
   * It always holds the latest value.
   * When a new subscriber joins, it immediately receives the current query
   * perfect for UI state that must be shared and reactive.
   */
  
  private readonly querySubject = 
    new BehaviorSubject<ApiApprovalsQuery>(DEFAULT_API_APPROVALS_QUERY);
// we expose only the observable version.

    readonly query$: Observable<ApiApprovalsQuery> = 
      this.querySubject.asObservable();

// getter for current value (synchronous access).

  getCurrentQuery(): ApiApprovalsQuery{
    return this.querySubject.value;
  }

  //Update search text
  /**
   * Important rule"
   * when search changes -> reset page to 1
   * why?
   * If user on page 5 and searches new text, page 5 may not exist in new results
   * 
   */

  setSearch(search: string): void {
    const current = this.querySubject.value;

    this.querySubject.next({
      ...current, // creates a new object reference
      //here i use the spread operator to maintain immutability. Instead of mutating the existing state object, I create  a new object reference.
      search: search.trim(),
      page:1
    });
  }

  setStatus(status: 'ALL' |  ApiStatus): void {
    const current = this.querySubject.value;

    this.querySubject.next({
      ...current,
      status,
      page: 1,
    });
  }

  //update page number

setPage(page: number): void {
  const current = this.querySubject.value;

  this.querySubject.next({
    ...current,
    page: Math.max(1,page)
  });
}
//update page size (limit) , when limt chnages -> reset page to 1

setLimit(limit: number): void {
  const current = this.querySubject.value;

  this.querySubject.next({
    ...current,
    limit,
    page: 1,
  });
}
reset(): void {
  this.querySubject.next(DEFAULT_API_APPROVALS_QUERY);
}
}
