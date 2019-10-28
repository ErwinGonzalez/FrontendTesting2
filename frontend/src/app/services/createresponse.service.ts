import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateresponseService {
  
  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient){}

  addRequest(id,url,date,status,idEvent){
    const obj = {
      id,
      url,
      date,
      status,
      idEvent
    };

    this.httpClient.post(`${this.uri}/createResponse/add`,obj)
          .subscribe(res=> console.log('Response Done'));
  }

  getRequests(){
    return this.httpClient.get(`${this.uri}/createResponse`);
  }
}
