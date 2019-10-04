import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchresponseService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }

  addRequest(id, url, date, search, data) {
    console.log(id);
    const obj = {
      id, url, date, search, data
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/searchResponse/add`, obj)
      .subscribe(res => console.log('Added response'));
  }

  getResponses() {
    return this.httpClient.get(`${this.uri}/requests/searchResponses`);
  }
}
