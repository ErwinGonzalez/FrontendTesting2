import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  uri = 'http://localhost:4000/requests';

  constructor(private httpClient: HttpClient) { }
  addRequest(id, url, date, idEvento, event) {
    const obj = {
      id,
      url,
      date,
      idEvento,
      event
    };
    console.log(obj);
    this.httpClient.post(`${this.uri}/Events/add`, obj)
      .subscribe(res => console.log('Request done'));
  }

  getRequests() {
    return this.httpClient.get(`${this.uri}/Events`);
  }

  updateRequest(updateID){

    let obj ={};
    this.httpClient.post(`${this.uri}/Events/update/${updateID}`,obj)
  }

  deleteEvent(id){
    console.log('event service '+id);
    this.httpClient.get(`${this.uri}/Events/delete/${id}`).subscribe(
      res =>{
        console.log(res)
      }
    );
  }
}
