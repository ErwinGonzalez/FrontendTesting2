import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreaterequestService {
  
  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }
  addRequest(id, url, date, create) {
    const obj = {
      id,
      url,
      date,
      create
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/createRequest/add`, obj)
      .subscribe(res => console.log('Request done'));
  }

  getRequests() {
    return this.httpClient.get(`${this.uri}/createRequest`);
  }
}
