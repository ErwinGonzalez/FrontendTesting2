import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangeResponseService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient){}

  addRequest(id,url,date,status){
    const obj = {
      id,
      url,
      date,
      status
    };

    this.httpClient.post(`${this.uri}/changeResponse/add`,obj)
          .subscribe(res=> console.log('Response Done'));
  }

  getRequests(){
    return this.httpClient.get(`${this.uri}/changeResponse`);
  }
}
