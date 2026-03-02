import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateApiPayload, CreateApiResponse } from '../../../core/models/create-api.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(
    private http: HttpClient
  ) {}
  
  private readonly baseUrl = `${environment.apiBaserUrl}/apis`;

  createApi(payload: CreateApiPayload): Observable<CreateApiResponse> {
    return this.http.post<CreateApiResponse>(this.baseUrl,payload)
   }
}
