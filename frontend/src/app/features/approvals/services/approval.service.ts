import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiApprovelApi, PaginationResponse, ApiStatus } from '../../../core/models/api-approval.model';
import { ApiApprovalsStore } from '../state/api-approvals.store';
import { Env } from '../../../core/services/env';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApprovalService {

  constructor(
    private http: HttpClient,
    private store: ApiApprovalsStore,
    private envService: Env
  ) {}

  fetchApis(): Observable<PaginationResponse<ApiApprovelApi>> {
   
    // step 1 get current query from store
    const query = this.store.getCurrentQuery();

    // step 2 get current env from header shared state
    const env = this.envService.getEnv();

    //step3 : Build query params
    let params = new HttpParams()
     .set('page', query.page.toString())
     .set('limit', query.limit.toString())
     .set('env', env);

     //only send status if not all
     if (query.status !== 'ALL') {
      params = params.set('status', query.status);
     }

     //send search only if exists
     if (query.search) {
      params = params.set('search',query.search);
     }

     return this.http.get<PaginationResponse<ApiApprovelApi>> (
      `${environment.apiBaserUrl}/approvals/apis`, { params}
     );
  }

  approveApi(apiId: string): Observable<any> {
    return this.http.patch(
      `${environment.apiBaserUrl}/approvals/apis/${apiId}/approve`, {}
    );
  }

  rejectApi(apiId: string, reason: string): Observable<any> {
    return this.http.patch(`${environment.apiBaserUrl}/approvals/apis/${apiId}/reject`, { reason });
  }
  
}
