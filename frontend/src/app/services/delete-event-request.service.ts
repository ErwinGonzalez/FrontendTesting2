import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteEventRequestService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }
  addRequest(id, url, date, deleteID) {
    const obj = {
      id,
      url,
      date,
      'delete':{
        'id': deleteID
      }
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/deleteRequest/add`, obj)
      .subscribe(res => console.log('Request done'));
  }

  getRequests() {
    return this.httpClient.get(`${this.uri}/deleteRequest`);
  }

}
