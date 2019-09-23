import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InforequestService {

  uri = 'http://localhost:4000/requests';

  constructor(private http: HttpClient) { }

  addRequest(RequestID, RequestURL, RequestDateTime) {
    const obj = {
      RequestID,
      RequestURL,
      RequestDateTime
    };
    console.log(obj);
    this.http.post(`${this.uri}/inforequest/add`, obj)
        .subscribe(res => console.log('Done'));
  }
}