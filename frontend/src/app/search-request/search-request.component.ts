import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { tap, map, filter } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";


import InfoResponse from '../info-request/classes/InfoResponse';
import Hardware from '../info-request/classes/Hardware';

@Component({
  selector: 'app-search-request',
  templateUrl: './search-request.component.html',
  styleUrls: ['./search-request.component.css']
})
export class SearchRequestComponent implements OnInit {

  dateStart: NgbDateStruct;
  dateEnd: NgbDateStruct;
  date: { year: number, month: number };
  timeStart: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  timeEnd: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  angForm: FormGroup;
  apiAdd: "http://localhost:3000/";
  requestsHardware: string[] = ["id01", "id02", "id03"];

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private startCalendar: NgbCalendar, private endCalendar: NgbCalendar) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: ['', Validators.required],
      FrontendIP: [{ value: '192.168.0.1', disabled: true }],
      RequestDateTime: [{ value: this.getDate(), disabled: true }],
      DateStart: ['', Validators.required],
      TimeStart: ['', Validators.required],
      DateEnd: ['', Validators.required],
      TimeEnd: ['', Validators.required]
    });
  }

  getList() {
    //make a server call to local, parse the hardware ids
    var obj = this.httpClient.get<InfoResponse[]>("http://127.0.0.1:3000/infoResponses")
      .pipe(map((reqs: InfoResponse[]) => reqs.map(req => new InfoResponse(req.id, req.url, req.date, req.hardware))))
      .subscribe(
        (res: InfoResponse[]) => {
          for (let req of res) {
            //console.log(req.hardware);
            var hard: Hardware[] = new Array();

            if (req && req.hardware) {
              var ids: string[] = Object.keys(req.hardware);
              var vals: Object[] = Object.values(req.hardware);
              for (let i = 0; i < ids.length; i++) {
                //console.log(vals);
                var tt: string[] = Object.values(vals[i]);
                //console.log(tt[0]+tt[1]+ids[i]);
                var h: Hardware = new Hardware(ids[i], tt[0], tt[1]);
                hard.push(h);

              }
              console.log(hard);
            }
            req.hardware = hard;
          }
          console.log(res);
        }
      );
  }
  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }
  sendPostRequest(month: string, time: string) {
    console.log(month);
    console.log(time);
    /*var request = new (id,url,datetime);
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
    );*/

    //this.irService.addRequest(id,url,datetime);
  }
}
