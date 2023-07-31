import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // API URL
  private apiUrl = environment.apiUrl

  // Reqest Header
  public httpOptions(): any {
    let token = environment.apiToken
    return {
      headers : new HttpHeaders ({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      })
    }
  }

  constructor(private httpClient: HttpClient) { }

  // Actor Endpoint
  getAllActor() {
    return this.httpClient.get<any>(`${this.apiUrl}/master/actor`, this.httpOptions())
  }
  insertActor(data: any) {
    return this.httpClient.post<any>(`${this.apiUrl}/master/actor`, {form_data : data}, this.httpOptions())
  }
  deleteActor(actorId: number) {
  return this.httpClient.delete<any>(`${this.apiUrl}/master/actor/${actorId}`, this.httpOptions());
  }
  
}