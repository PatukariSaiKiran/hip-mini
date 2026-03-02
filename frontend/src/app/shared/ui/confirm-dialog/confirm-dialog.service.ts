import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogOptions, ConfirmDialogRequest } from './confirm-dialog.model';


@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {


  private readonly requestsSubject = new Subject<ConfirmDialogRequest>();

  // Host component subscribes to this and renders the dialog UI.
  readonly requests$ = this.requestsSubject.asObservable();

  /**
   * Purpose:
   * - Open a confirm dialog and return result (true/false)
   * Interview line:
   * - "I expose dialogs via a service and return an Observable so pages can react cleanly."
   */
  open(options: ConfirmDialogOptions): Observable<boolean> {
    console.log(' open() called', options);
    
    return new Observable<boolean>((observer) => {
      const req: ConfirmDialogRequest = {
        options,
        resolve: (result: boolean) => {
          observer.next(result);
          observer.complete();
         

        },
      };
      this.requestsSubject.next(req);

      return () => {};
    });
  }
  
}
