import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { tap } from "rxjs/operators";
import { InforequestService } from '../services/inforequest.service';
import { InfoResponseService } from '../services/inforesponse.service';
import Hardware from './classes/Hardware';
import InfoRequest from './classes/InfoRequest';
import InfoResponse from './classes/InfoResponse';

@Component({
  selector: 'app-info-request',
  templateUrl: './info-request.component.html',
  styleUrls: ['./info-request.component.css']
})
export class InfoRequestComponent implements OnInit {

  angForm: FormGroup;
  requestsObservable: Observable<Request[]>;
  apiAdd: "http://localhost:3000/";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irqService: InforequestService, private irp: InfoResponseService) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: ['', Validators.required],
      FrontendIP: [{ value: '192.168.0.1', disabled: true }],
      RequestDateTime: [{ value: this.getDate(), disabled: true }]
    });
  }
  ngOnInit() {
    this.updateList();
  }

  updateList() {
    this.requestsObservable = this.httpClient.get<InfoRequest[]>("http://127.0.0.1:3000/inforequests").pipe(tap(console.log));
  }

  sendPostRequest(id: string, url: string, date: string) {
    var request = new InfoRequest(id, url, date);

    this.httpClient.post("http://127.0.0.1:3000/inforequests", request).subscribe(
      response => {
        console.log('POST Request is successful ', response);


        var obj = JSON.parse(JSON.stringify(response));
        console.log(obj);
        this.irqService.addRequest(obj.id, obj.url, obj.date);
        this.updateList();
      },
      error => {
        console.log('Error', error);
      }
    );
    /**
     * TODO no encuentro el error, 
     * los datos se envian bien y se guardan, se pueden leer 
     * y no tienen errores en el esquema
     */
    this.httpClient.get<InfoResponse[]>("http://127.0.0.1:3000/infoResponses")
      //.pipe(map((reqs: InfoResponse[]) => reqs.map(req => new InfoResponse(req.id, req.url, req.date, req.hardware))))
      .subscribe(
        (res: InfoResponse[]) => {
          for (let req of res) {
            //console.log(req.hardware);
            var hard: Hardware[] = new Array();
            console.log(req);
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
          this.irp.addRequest(res[0].id, res[0].url, res[0].date, res[0].hardware)
        }
      );
    //this.irService.addRequest(id,url,datetime);
  }

  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }
}
