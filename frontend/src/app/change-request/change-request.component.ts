import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeRequestService } from '../services/changerequest.service';
import { InfoResponseService } from '../services/inforesponse.service';

import InfoResponse from '../info-request/classes/InfoResponse';

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
  selectedSensor = "Select a Hardware";
  hardwareType = "";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private crs: ChangeRequestService, private irp: InfoResponseService) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: ['', Validators.required],
      PlatformURL: [{ value: '192.168.0.1', disabled: false }],
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

  changeSelected(event : any) {
     
    var selectedPlatform = event.target.value;
    console.log(this.infoResponses.find(function (element) {
      return element.id == selectedPlatform;
    }));
    let hardware = this.infoResponses.find(function (element) {
      return element.id == selectedPlatform;
    }).hardware;
    console.log(hardware.length);
    this.selectedSensor = "Select a Hardware";
    this.requestsHardware = [];
    for (let i = 0; i < hardware.length; i++) {
      this.requestsHardware.push(hardware[i]);
    }
  }

  changeSelectedHw(event: any) {
    this.selectedSensor = event.target.value;
    this.hardwareType = "input";
  }

  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }

  sendChangeRequest(id, url, status, freq, text) {

    var stat: boolean = false;
    if (status == "true")
      stat = true;

      var ss = this.selectedSensor;
    var change = {    };
    change[ss] = {
      "status":stat,
      "freq": +freq,
      "text": text
    };
    console.log(change);
    this.crs.addRequest(id, url, this.getDate(),change);

  }
} 
