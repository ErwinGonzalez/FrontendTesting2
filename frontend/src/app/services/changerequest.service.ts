import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }

  addRequest(id,url,date,change){
    console.log(id);
    const obj = {
      id,
      url,
      date,
      change 
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/changeRequest/add`,obj)
      .subscribe(res=> console.log('Request done')); 
  }

  getRequests(){
    return this.httpClient.get(`${this.uri}/changeRequest`);
  }
}
