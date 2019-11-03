import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteEventResponseService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }
  addRequest(id, url, date, status) {
    const obj = {
      id,
      url,
      date,
      status
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/deleteResponse/add`, obj)
      .subscribe(res => console.log('Response done'));
  }

  getRequests() {
    return this.httpClient.get(`${this.uri}/deleteResponse`);
  }
}
