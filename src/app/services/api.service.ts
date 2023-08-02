import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private token: string | null = null;

  constructor(private httpClient: HttpClient) {
    this.token = localStorage.getItem('token');
  }
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }
  private getAuthToken(): string | null {
    return this.token;
  }
  private httpOptions(): any {
    const token = this.getAuthToken();
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };
    } else {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    }
  }
  getAllActor() {
    return this.httpClient.get<any>(`${this.apiUrl}/master/actor`, this.httpOptions());
  }

  insertActor(data: any) {
    return this.httpClient.post<any>(`${this.apiUrl}/master/actor`, {form_data: data}, this.httpOptions());
  }

  updateActor(actorId: number, data: any) {
    return this.httpClient.put<any>(`${this.apiUrl}/master/actor/${actorId}`, { form_data: data }, this.httpOptions());
  }

  getActorById(id: number) {
    return this.httpClient.get<any>(`${this.apiUrl}/actor/${id}`, this.httpOptions());
  }

  deleteActor(actorId: number) {
    return this.httpClient.delete<any>(`${this.apiUrl}/master/actor/${actorId}`, this.httpOptions());
  }


}
