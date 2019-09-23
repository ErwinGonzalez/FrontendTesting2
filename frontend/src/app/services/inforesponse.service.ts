import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfoResponseService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }

  addRequest(RequestID, RequestURL, RequestDateTime, RequestHardwareData) {
    const obj = {
      RequestID,
      RequestURL,
      RequestDateTime,
      RequestHardwareData
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/infoResponse/add`, obj)
        .subscribe(res => console.log('Response Done'));
  }
}
