import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpdateRequestService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }
  addRequest(id, url, date, update) {
    const obj = {
      id,
      url,
      date,
      update
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/updateRequest/add`, obj)
      .subscribe(res => console.log('Request done'));
  }

  getRequests() {
    return this.httpClient.get(`${this.uri}/updateRequest`);
  }
}
