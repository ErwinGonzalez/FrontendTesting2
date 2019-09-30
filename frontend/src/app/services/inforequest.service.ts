import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InforequestService {

  uri = 'http://localhost:4000/requests';

  constructor(private http: HttpClient) { }

  addRequest(id, url, date) {
    const obj = {
      id,
      url,
      date
    };
    console.log(id);
    console.log(obj);
    this.http.post(`${this.uri}/infoRequest/add`, obj)
        .subscribe(
          
          res => console.log('Done'));
  }

  
}