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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info-request',
  templateUrl: './info-request.component.html',
  styleUrls: ['./info-request.component.css']
})
export class InfoRequestComponent implements OnInit {

  angForm: FormGroup;
  requestsObservable: Observable<Request[]>;
  apiAdd: "http://localhost:3000/";
  frontendURL="192.168.1.14";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irqService: InforequestService, private irp: InfoResponseService, private toastr: ToastrService) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: ['', Validators.required],
      PlatformURL: ['localhost:3000', Validators.required],
      RequestDateTime: [{ value: this.getDate(), disabled: true }]
    });
  }
  ngOnInit() {
    this.updateList();
  }

  updateList() {
    //this.requestsObservable = this.httpClient.get<InfoRequest[]>("http://127.0.0.1:3000/inforequests").pipe(tap(console.log));
  }

  sendPostRequest() {
    //var request = new InfoRequest(id, url, date);
    let frontendID = this.angForm.controls.FrontendID.value;
    let platformURL = this.angForm.controls.PlatformURL.value;
    let date = this.getDate();
    console.log(frontendID);
    console.log(platformURL);
    console.log(date);
    this.irqService.addRequest(frontendID,this.frontendURL, date);
    
    var obj = {
      "id":frontendID,
      "url":this.frontendURL,
      "date":date
    }
    
        //this.httpClient.get("http://127.0.0.1:3000/infoResponses")
        //res => {
          //console.log(res);
          //let req = res[0];
      //.pipe(map((reqs: InfoResponse[]) => reqs.map(req => new InfoResponse(req.id, req.url, req.date, req.hardware))))
    this.httpClient.post(`http://${platformURL}/info`,obj)
      .subscribe(
        res =>{
          /*console.log(res);
          let re1 = res[1];*/
          console.log(res);
          let req = res as InfoResponse;
          //let responseFields: String[] = Object.values(req);
          let hardwareList: Hardware[] = [];
          //let req = new InfoResponse(responseFields[0],responseFields[1],responseFields[2], responseFields[3]);
          //let req = re1 as InfoResponse;
          var ids: string[] = Object.keys(req.hardware);
          var vals: Object[] = Object.values(req.hardware);
          for (let i = 0; i < ids.length; i++) {
            var tt: string[] = Object.values(vals[i]);
            var h: Hardware = new Hardware(ids[i], tt[0], tt[1]);
            hardwareList.push(h);
          }
          req.hardware = hardwareList
          console.log(req);

          let infoResponses = [];
          this.irp.getRequests().subscribe(
            res => {
              var obj = JSON.stringify(res);
              var json = JSON.parse(obj);
              
              let _id;

              json.forEach(element => {
                console.log(element._id);
                _id = element._id;
                var info: InfoResponse = new InfoResponse(element.id, element.url, element.date, element.hardware);

                //console.log(info);
                infoResponses.push(info);

              });
              console.log(infoResponses);
              var exists = infoResponses.find(function (element) {
                return element.id == req.id;
              });

              console.log(exists);
              this.showSuccess(req.id,req.url);
              if(exists){
                console.log(_id);
                this.irp.update(req.id,req.url,req.date,req.hardware,_id);
              }else{
                this.irp.addRequest(req.id,req.url,req.date,req.hardware);
              }
            }
          );
        }
      );
  }

  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }
  showSuccess(platID:string, platURL:string) {
    this.toastr.success(`${platID} with URL ${platURL}`,"Successfully added platform!");
  }
}
