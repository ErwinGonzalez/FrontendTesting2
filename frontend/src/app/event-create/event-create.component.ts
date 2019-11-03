import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InfoResponseService } from '../services/inforesponse.service';
import InfoResponse from '../info-request/classes/InfoResponse';
import { CreaterequestService } from '../services/createrequest.service';
import { CreateresponseService } from '../services/createresponse.service';
import { ToastrService } from 'ngx-toastr';
import * as myGlobal from '../globals';
import { EventService } from '../services/events.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  angForm: FormGroup;
  frontendID = myGlobal.FrontendName;
  frontendURL = myGlobal.FrontendIP;

  platformsList = [];
  selectedPlatform = "";
  selectedPlatformIf = "";
  selectedPlatformThen = "";
  selectedPlatformElse = "";

  hardwareList = [];
  hardwareThenList = [];
  hardwareElseList = [];

  selectedHardware = "";
  selectedElseHardware = "";
  selectedThenHardware = "";

  hardware;
  hardwareElse;
  hardwareThen;
  hardwareType;
  hardwareTypeElse;
  hardwareTypeThen;

  destinationPlatformURL = "";
  ifPlatformURL = "";
  thenPlatformURL = "";
  elsePlatformURL = "";
  updateFrequency = "";

  conditionSelect = "=";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irp: InfoResponseService, private crq: CreaterequestService, private crp: CreateresponseService, private eventsrv: EventService, private toastr: ToastrService) { }


  ngOnInit() {
    this.createForm();
    this.getList();
    console.log(this.conditionSelect);
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: [this.frontendID, Validators.required],
      DestinationPlatformSelect: [null, Validators.required],
      DestinationPlatformURL: [{ value: '', disabled: true }, Validators.required],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: ['-1', [Validators.required, Validators.min(0)]],
      PlatformURL: [{ value: this.destinationPlatformURL, disabled: true }, Validators.required],
      UpdateFrequency: [this.updateFrequency, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
      ConditionSelect: ['Equal', Validators.required],
      SensorValue: [''],
      SensorStatus: [''],
      SensorFrequency: [''],
      SensorText: [''],
      SensorStatusThen: [''],
      SensorFrequencyThen: [''],
      SensorTextThen: [''],
      PlatformSelectThen: [null, Validators.required],
      HardwareSelectThen: ['-1', [Validators.required, Validators.min(0)]],
      SensorStatusElse: [''],
      SensorFrequencyElse: [''],
      SensorTextElse: [''],
      PlatformSelectElse: [null, Validators.required],
      HardwareSelectElse: ['-1', [Validators.required, Validators.min(0)]]
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
          this.platformsList.push(info);

        });
        console.log(this.platformsList);
      }
    );
  }
  changeSelected(event: any) {
    console.log(event.target.id);
    let sPlat = event.target.value;

    var selected = this.platformsList.find(function (element) {
      return element.id == sPlat;
    });
    let hardware = selected.hardware;
    if (event.target.id == "DestinationPlatformSelect") {
      this.destinationPlatformURL = selected.url;
      this.selectedPlatform = event.target.value;
      return;
    }
    if (event.target.id == "PlatformSelect") {
      this.ifPlatformURL = selected.url;
      this.angForm.controls.HardwareSelect.setValue('-1');
      this.hardware = null;
      this.hardwareType = null;
      this.hardwareList = [];
      this.selectedPlatformIf = event.target.value;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareList.push(hardware[i]);
      }

    }
    if (event.target.id == "PlatformSelectThen") {
      this.thenPlatformURL = selected.url;
      this.angForm.controls.HardwareSelectThen.setValue('-1');
      this.hardwareThen = null;
      this.hardwareTypeThen = null;
      this.hardwareThenList = [];
      this.selectedPlatformThen = event.target.value;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareThenList.push(hardware[i]);
      }
      console.log(this.hardwareThenList);
    }
    if (event.target.id == "PlatformSelectElse") {
      this.elsePlatformURL = selected.url;
      this.angForm.controls.HardwareSelectElse.setValue('-1');
      this.hardwareElse = null;
      this.hardwareTypeElse = null;
      this.hardwareElseList = [];
      this.selectedPlatformElse = event.target.value;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareElseList.push(hardware[i]);
      }
      console.log(this.hardwareElseList);
    }
    console.log(hardware.length);
    this.updateValidators();
    //console.log(this.platformURL);

  }

  changeSelectedHw(event: any) {
    //TODO verificar cual fue el dropdown que llamo
    console.log(event.target);
    console.log(event.target.id);

    if (event.target.id == "HardwareSelect") {
      this.selectedHardware = event.target.value;
      var sSen = this.selectedHardware;
      var sPlat = this.selectedPlatformIf;
      this.hardwareList = this.platformsList.find(function (element) {
        return element.id == sPlat;
      }).hardware;
      console.log(this.hardwareList);
      this.hardware = this.hardwareList.find(function (element) {
        return element.id == sSen;
      });
      console.log(this.hardware);
      this.hardwareType = this.hardware.detail.type.toLowerCase();

      console.log(this.angForm.controls.HardwareSelect.value);
      console.log(event.target.value);
      console.log(this.hardwareType);
    }
    if (event.target.id == "HardwareSelectThen") {
      this.selectedThenHardware = event.target.value;
      var sSen = this.selectedThenHardware;
      var sPlat = this.selectedPlatformThen;
      this.hardwareThenList = this.platformsList.find(function (element) {
        return element.id == sPlat;
      }).hardware;
      console.log(this.hardwareThenList);
      this.hardwareThen = this.hardwareThenList.find(function (element) {
        console.log(element.id);
        return element.id == sSen;
      });
      console.log(this.hardwareThen);
      this.hardwareTypeThen = this.hardwareThen.detail.type.toLowerCase();
      console.log(this.hardwareTypeThen);
    }
    if (event.target.id == "HardwareSelectElse") {
      this.selectedElseHardware = event.target.value;
      var sSen = this.selectedElseHardware;
      var sPlat = this.selectedPlatformElse;
      this.hardwareElseList = this.platformsList.find(function (element) {
        return element.id == sPlat;
      }).hardware;
      console.log(this.hardwareElseList);
      this.hardwareElse = this.hardwareElseList.find(function (element) {
        return element.id == sSen;
      });
      console.log(this.hardwareElse);
      this.hardwareTypeElse = this.hardwareElse.detail.type.toLowerCase();
      console.log(this.hardwareTypeElse);
    }


    this.updateValidators();
  }
  onValChange(value: any) {
    console.log(value);
    if (value == "Equal")
      this.conditionSelect = "=";
    if (value == "NotEqual")
      this.conditionSelect = "!=";
    if (value == "LessThan")
      this.conditionSelect = "<";
    if (value == "GreaterThan")
      this.conditionSelect = ">";
    if (value == "LessOrEqual")
      this.conditionSelect = "=<";
    if (value == "GreaterOrEqual")
      this.conditionSelect = "=>";
    console.log(this.conditionSelect);
  }
  updateValidators() {
    
    if (this.hardwareType == 'output') {
      this.angForm.controls.SensorText.setValidators([Validators.required]);
      this.angForm.controls.SensorStatus.setValidators([Validators.required]);
      this.angForm.controls.SensorValue.setValidators([]);
      this.angForm.controls.SensorFrequency.setValidators([]);
    } else if (this.hardwareType == 'input') {
      this.angForm.controls.SensorText.setValidators([]);
      this.angForm.controls.SensorStatus.setValidators([]);
      this.angForm.controls.SensorValue.setValidators([Validators.required, Validators.min(0), Validators.max(1024), Validators.pattern("^[0-9]*$")]);
      this.angForm.controls.SensorFrequency.setValidators([Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]);
    }
    if (this.hardwareTypeThen == 'output') {
      this.angForm.controls.SensorTextThen.setValidators([Validators.required]);
      this.angForm.controls.SensorStatusThen.setValidators([Validators.required]);
      this.angForm.controls.SensorFrequencyThen.setValidators([]);
    } else if (this.hardwareTypeThen == 'input') {
      this.angForm.controls.SensorFrequencyThen.setValidators([Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]);
      this.angForm.controls.SensorTextThen.setValidators([]);
      this.angForm.controls.SensorStatusThen.setValidators([]);
    }
    if (this.hardwareTypeElse == 'output') {
      this.angForm.controls.SensorTextElse.setValidators([Validators.required]);
      this.angForm.controls.SensorStatusElse.setValidators([Validators.required]);
      this.angForm.controls.SensorFrequencyElse.clearValidators();
    } else if (this.hardwareTypeElse == 'input') {
      this.angForm.controls.SensorTextElse.clearValidators();
      this.angForm.controls.SensorStatusElse.clearValidators();
      this.angForm.controls.SensorFrequencyElse.setValidators([Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]);
    }

    this.updateValidity();
  }

  updateValidity() {
    this.angForm.controls.SensorText.updateValueAndValidity();
    this.angForm.controls.SensorStatus.updateValueAndValidity();
    this.angForm.controls.SensorValue.updateValueAndValidity();
    this.angForm.controls.SensorFrequency.updateValueAndValidity();
    this.angForm.controls.SensorFrequencyThen.updateValueAndValidity();
    this.angForm.controls.SensorTextThen.updateValueAndValidity();
    this.angForm.controls.SensorStatusThen.updateValueAndValidity();
    this.angForm.controls.SensorTextElse.updateValueAndValidity();
    this.angForm.controls.SensorStatusElse.updateValueAndValidity();
    this.angForm.controls.SensorFrequencyElse.updateValueAndValidity();
  }
  sendCreateEvent() {
    var ifStmt = {
      "left": {
        "url": this.ifPlatformURL,
        "id": this.selectedHardware,
        "freq": this.angForm.controls.UpdateFrequency.value
      },
      "condition": this.conditionSelect,
    };
    if (this.hardwareType == 'input') {
      ifStmt["right"] = {
        "sensor": this.angForm.controls.SensorValue.value,
        "freq": this.angForm.controls.SensorFrequency.value
      }
    } else if (this.hardwareType == 'output') {
      ifStmt["right"] = {
        "status": this.angForm.controls.SensorStatus.value,
        "text": this.angForm.controls.SensorText.value
      }
    }
    var thenStmt = {
      "url": this.thenPlatformURL,
      "id": this.selectedThenHardware,
    };
    if (this.hardwareTypeThen == 'input') {
      thenStmt["freq"] = this.angForm.controls.SensorFrequencyThen.value
    } else if (this.hardwareTypeThen == 'output') {
      thenStmt["status"] = this.angForm.controls.SensorStatusThen.value,
        thenStmt["text"] = this.angForm.controls.SensorTextThen.value
    }
    var elseStmt = {
      "url": this.elsePlatformURL,
      "id": this.selectedElseHardware
    };
    if (this.hardwareTypeElse == 'input') {
      elseStmt["freq"] = this.angForm.controls.SensorFrequencyElse.value
    } else if (this.hardwareTypeElse == 'output') {
      elseStmt["status"] = this.angForm.controls.SensorStatusElse.value,
        elseStmt["text"] = this.angForm.controls.SensorTextElse.value
    }
    var create = {
      "if": ifStmt,
      "then": thenStmt,
      "else": elseStmt
    };

    var obj = {
      "id": this.frontendID,
      "url": this.frontendURL,
      "date": this.getDate(),
      "create": create
    };
    console.log(obj);


    //this.httpClient.get("http://127.0.0.1:3000/createResponses")
    this.httpClient.post(`http://${this.destinationPlatformURL}/create`, obj)
      .subscribe(
        res => {
          console.log(res);
          var req = res;

          var responseFields: String[] = Object.values(req);
          console.log(responseFields);
          this.crp.addRequest(responseFields[0], responseFields[1], responseFields[2], responseFields[3], responseFields[4]);
          if (responseFields[3] == 'OK')
            this.sendSuccess(responseFields[0], responseFields[1]);
          else if (responseFields[3] == 'ERROR')
            this.sendError(responseFields[0], responseFields[1]);
          this.crq.addRequest(this.frontendID, this.destinationPlatformURL, this.getDate(), create);
          this.eventsrv.addRequest(this.frontendID, this.destinationPlatformURL, this.getDate(), responseFields[4], create);
        }
      );

  }
  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }
  sendSuccess(platID, platURL) {
    this.toastr.success(`${platID} with URL ${platURL} sent an OK message`, "Response from platform saved!");
  }
  sendError(platID, platURL) {
    this.toastr.error(`${platID} with URL ${platURL} sent an ERROR message`, "Response from platform saved!");
  }
}
