import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from  "rxjs/Observable";
import { tap, map, filter } from "rxjs/operators";
import { HttpClient } from  "@angular/common/http";

import InfoRequest from './classes/InfoRequest'
import { InforequestService } from '../services/inforequest.service';



@Component({
  selector: 'app-info-request',
  templateUrl: './info-request.component.html',
  styleUrls: ['./info-request.component.css']
})
export class InfoRequestComponent implements OnInit {

  angForm: FormGroup;
  requestsObservable : Observable<Request[]>;
  apiAdd: "http://localhost:3000/";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irService: InforequestService) {
    this.createForm();
  }

  createForm(){
    this.angForm = this.fb.group({
      FrontendID: ['',Validators.required],
      FrontendIP: [{value:'192.168.0.1', disabled:true}],
      RequestDateTime: [{value:this.getDate(),disabled:true}]
    });
  }
  ngOnInit() {
    this.updateList();
  }

  updateList(){
    this.requestsObservable = this.httpClient.get<InfoRequest[]>("http://127.0.0.1:3000/inforequests").pipe(tap(console.log));
  }

  sendPostRequest(id: string, url: string, datetime: string){
    var request = new InfoRequest(id,url,datetime);
    this.httpClient.post("http://127.0.0.1:3000/inforequests", request).subscribe(
      response => {
        console.log('POST Request is successful ', response);
        
        var stringResponse = JSON.stringify(response);
        var obj =JSON.parse(stringResponse);
        
        this.irService.addRequest(obj.id,obj.url,obj.datetime);
        this.updateList();
      },
      error => {
        console.log('Error', error);
      }
    );

    //this.irService.addRequest(id,url,datetime);
  }

  getDate():string{
    var currDate = new Date();
    return currDate.toISOString();
  }
}
