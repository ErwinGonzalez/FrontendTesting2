import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeRequestService } from '../services/changerequest.service';
import { InfoResponseService } from '../services/inforesponse.service';

import InfoResponse from '../info-request/classes/InfoResponse';
import Hardware from '../info-request/classes/Hardware';
import ChangeResponse from './classes/ChangeResponse';
import { ChangeResponseService } from '../services/change-response.service';

@Component({
  selector: 'app-change-request',
  templateUrl: './change-request.component.html',
  styleUrls: ['./change-request.component.css']
})
export class ChangeRequestComponent implements OnInit {

  angForm: FormGroup;
  apiAdd: "http://localhost:3000/";
  infoResponses = [];
  requestsHardware = [];
  platformHardware = [];
  selectedPlatform = "Select a Platform";
  frontendID="CCVIII-FE";
  selectedSensor = "Select a Hardware";
  hardwareList = [];
  hardware;
  hardwareType ;
  platUrl = "192.165.0.1";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private crs: ChangeRequestService, private irp: InfoResponseService, private crps: ChangeResponseService) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: [this.frontendID, [Validators.minLength(1),Validators.required]],
      PlatformURL: [{ value: '', disabled: true }],
      RequestDateTime: [{ value: this.getDate(), disabled: true }],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: [null, Validators.required],
      SensorStatus: ['', Validators.required],
      SensorFrequency: ['', Validators.required],
      SensorText: ['', Validators.required]
    });
  }
  getList() {
    //TODO make a server call to local, parse the hardware ids
    this.irp.getRequests().subscribe(
      res => {
        var obj = JSON.stringify(res);
        var json = JSON.parse(obj);
        json.forEach(element => {

          var info: InfoResponse = new InfoResponse(element.id, element.url, element.date, element.hardware);

          //console.log(info);
          this.infoResponses.push(info);

        });
        console.log(this.infoResponses);
      }
    );
  }

  changeSelected(event: any) {

    this.selectedPlatform = event.target.value;
    let sPlat = this.selectedPlatform;

    var selected = this.infoResponses.find(function (element) {
      return element.id == sPlat;
    });
    let hardware = selected.hardware;
    this.platUrl = selected.url;
    console.log(hardware.length);
    console.log(this.platUrl);
    this.selectedSensor = "Select a Hardware";
    this.requestsHardware = [];
    for (let i = 0; i < hardware.length; i++) {
      this.requestsHardware.push(hardware[i]);
    }
  }

  changeSelectedHw(event: any) {
    this.selectedSensor = event.target.value;
    var sSen = this.selectedSensor;
    var sPlat = this.selectedPlatform;
    this.hardwareList = this.infoResponses.find(function (element){
      return element.id == sPlat;
    }).hardware;
    console.log(this.hardwareList);
    this.hardware = this.hardwareList.find(function (element){
        return element.id == sSen;
    });
    console.log(this.hardware);
    console.log(this.hardware.detail.type);
    this.hardwareType = this.hardware.detail.type;
  }

  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }

  sendChangeRequest() {

    var id = this.angForm.controls.FrontendID.value;
    var url = this.angForm.controls.PlatformURL.value;
    var status = this.angForm.controls.SensorStatus.value;
    var freq = this.angForm.controls.SensorFrequency.value;
    var text = this.angForm.controls.SensorText.value;

    var stat: boolean = false;
    if (status == "true")
      stat = true;

    var ss = this.selectedSensor;
    var change = {};
    change[ss] = {
      "status": stat,
      "freq": +freq,
      "text": text
    };
    console.log(change);
    this.crs.addRequest(id, url, this.getDate(), change);
    //TODO send http request

    this.httpClient.get("http://127.0.0.1:3000/changeResponses")
    .subscribe(
      res =>{
        console.log(res);
        var req = res[0];
        var responseFields: String []= Object.values(req);
        console.log(responseFields);
        this.crps.addRequest(responseFields[0],responseFields[1],responseFields[2],responseFields[3]);
      }
    )
  }
} 
