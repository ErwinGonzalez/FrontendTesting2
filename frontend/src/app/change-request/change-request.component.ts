import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeResponseService } from '../services/change-response.service';
import { ChangeRequestService } from '../services/changerequest.service';
import { InfoResponseService } from '../services/inforesponse.service';
import { ToastrService } from 'ngx-toastr';
import InfoResponse from '../info-request/classes/InfoResponse';
import ChangeResponse from './classes/ChangeResponse';

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
  frontendID = "CCVIII-FE";
  selectedSensor = "Select a Hardware";
  hardwareList = [];
  hardware;
  hardwareType;
  platUrl = "192.165.0.1";
  frontendURL = "192.168.1.14";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private crs: ChangeRequestService, private irp: InfoResponseService, private crps: ChangeResponseService, private toastr: ToastrService) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: [this.frontendID, [Validators.minLength(1), Validators.required]],
      PlatformURL: [{ value: '', disabled: true }],
      RequestDateTime: [{ value: this.getDate(), disabled: true }],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: [null, Validators.required],
      SensorStatus: ['', Validators.required],
      SensorFrequency: ['', Validators.required],
      SensorText: ''
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
    this.hardwareList = this.infoResponses.find(function (element) {
      return element.id == sPlat;
    }).hardware;
    console.log(this.hardwareList);
    this.hardware = this.hardwareList.find(function (element) {
      return element.id == sSen;
    });
    console.log(this.hardware);
    console.log(this.hardware.detail.type);
    this.hardwareType = this.hardware.detail.type;
    if (this.hardwareType == 'output') {
      this.angForm.controls.SensorText.setValidators([Validators.required]);
      this.angForm.controls.SensorText.setValue('');
    }
    if (this.hardwareType == 'input'){
      this.angForm.controls.SensorText.setValidators([]);
      this.angForm.controls.SensorText.setValue(' ');
      this.angForm.controls.SensorText.clearValidators();
    }
  }

  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }

  sendChangeRequest() {

    var id = this.angForm.controls.FrontendID.value;
    var url = this.platUrl;
    var status = this.angForm.controls.SensorStatus.value;
    var freq = this.angForm.controls.SensorFrequency.value;
    var text = this.angForm.controls.SensorText.value;

    var stat: boolean = false;
    if (status == "true")
      stat = true;

    var ss = this.selectedSensor;
    var change = {};
    if (this.hardwareType == 'input') {
      change[ss] = {
        "status": stat,
        "freq": +freq
      };
    }else{
      change[ss] = {
        "status": stat,
        "freq": +freq,
        "text": text
      };
    }
    console.log(change);
    this.crs.addRequest(id, this.frontendURL, this.getDate(), change);
    //TODO send http request

    var obj = {
      "id": id,
      "url": this.frontendURL,
      "date": this.getDate(),
      change
    };
    console.log(obj);
    this.httpClient.post(`http://${url}/change`,obj)
    //this.httpClient.get("http://127.0.0.1:3000/changeResponses")
      .subscribe(
        res => {
          console.log(res);
          //var req = res[0];
          let req = res as ChangeResponse;
          var responseFields: String[] = Object.values(req);
          console.log(responseFields);
          this.crps.addRequest(responseFields[0], responseFields[1], responseFields[2], responseFields[3]);
          if (responseFields[3] == 'OK')
            this.sendSuccess(responseFields[0], responseFields[1]);
          else if (responseFields[3] == 'ERROR')
            this.sendError(responseFields[0], responseFields[1]);
        }
      );
  }
  sendSuccess(platID, platURL) {
    this.toastr.success(`${platID} with URL ${platURL} sent an OK message`, "Response from platform saved!");
  }
  sendError(platID, platURL) {
    this.toastr.error(`${platID} with URL ${platURL} sent an ERROR message`, "Response from platform saved!");
  }
} 
