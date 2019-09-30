import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchRequestService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }

  addRequest(id, url, date, search) {
    const obj = {
      id,
      url,
      date,
      search
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/searchRequest/add`, obj)
        .subscribe(res => console.log('Request Done'));
  }
  getRequests(){
    return this.httpClient.get(`${this.uri}/searchRequest`);
  }
}
