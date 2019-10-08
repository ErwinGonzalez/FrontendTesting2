import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfoResponseService {

  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }

  addRequest(id, url, date, hardware) {
    const obj = {
      id,
      url,
      date,
      hardware
    };
    //console.log(obj);
    this.httpClient.post(`${this.uri}/infoResponse/add`, obj)
        .subscribe(res => console.log('Response Done'));
  }
  getRequests(){
    return this.httpClient.get("http://localhost:4000/requests/InfoResponse");
  }
  update(id,url,date,hardware,updateID){
    const obj = {
      id,
      url,
      date,
      hardware
    };
    this.httpClient.post(`${this.uri}/infoResponse/update/${updateID}`,obj)
    .subscribe(res=>console.log('Updated!'));
  }
}
