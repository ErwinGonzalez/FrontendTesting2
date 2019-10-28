import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InfoResponseService } from '../services/inforesponse.service';
import InfoResponse from '../info-request/classes/InfoResponse';
import { CreaterequestService } from '../services/createrequest.service';
import { CreateresponseService } from '../services/createresponse.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  angForm: FormGroup;
  frontendID = "CCVIII-FE";

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
  hardwareType;

  destinationPlatformURL = "";
  ifPlatformURL = "";
  thenPlatformURL = "";
  elsePlatformURL = "";
  updateFrequency = "";

  conditionSelect = "=";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irp: InfoResponseService, private crq: CreaterequestService, private crp: CreateresponseService, private toastr: ToastrService) { }


  ngOnInit() {
    this.createForm();
    this.getList();
    console.log(this.conditionSelect);
  }

  createForm() {
    this.angForm = this.fb.group({
      FrontendID: [this.frontendID, Validators.required],
      DestinationPlatformSelect: [null, Validators.required],
      DestinationPlatform: [{ value: '', disabled: true }, Validators.required],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: [null, Validators.required],
      PlatformURL: [{ value: this.destinationPlatformURL, disabled: true }, Validators.required],
      UpdateFrequency: [this.updateFrequency, [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
      ConditionSelect: ['Equal', Validators.required],
      SensorValue: ['', [Validators.required, Validators.min(0), Validators.max(1024), Validators.pattern("^[0-9]*$")]],
      SensorStatus: ['', Validators.required],
      SensorFrequency: ['', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
      SensorText: ['', Validators.required],
      SensorStatusThen: ['', Validators.required],
      SensorFrequencyThen: ['', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
      SensorTextThen: ['', Validators.required],
      PlatformSelectThen: [null, Validators.required],
      HardwareSelectThen: [null, Validators.required],
      SensorStatusElse: ['', Validators.required],
      SensorFrequencyElse: ['', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
      SensorTextElse: ['', Validators.required],
      PlatformSelectElse: [null, Validators.required],
      HardwareSelectElse: [null, Validators.required]
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
      this.selectedHardware = "Select a Hardware";
      this.hardwareList = [];
      this.selectedPlatformIf = event.target.value;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareList.push(hardware[i]);
      }
    }
    if (event.target.id == "PlatformSelectThen") {
      this.thenPlatformURL = selected.url;
      this.selectedThenHardware = "Select a Hardware";
      this.hardwareThenList = [];
      this.selectedPlatformThen = event.target.value;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareThenList.push(hardware[i]);
      }
    }
    if (event.target.id == "PlatformSelectElse") {
      this.elsePlatformURL = selected.url;
      this.selectedElseHardware = "Select a Hardware";
      this.hardwareElseList = [];
      this.selectedPlatformElse = event.target.value;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareElseList.push(hardware[i]);
      }
    }
    console.log(hardware.length);
    //console.log(this.platformURL);

  }

  changeSelectedHw(event: any) {
    //TODO verificar cual fue el dropdown que llamo
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
    }
    if (event.target.id == "HardwareSelectThen") {
      this.selectedThenHardware = event.target.value;
      var sSen = this.selectedHardware;
      var sPlat = this.selectedPlatformThen;
      this.hardwareThenList = this.platformsList.find(function (element) {
        return element.id == sPlat;
      }).hardware;
      console.log(this.hardwareThenList);
      this.hardware = this.hardwareThenList.find(function (element) {
        console.log(element.id);
        return element.id == sSen;
      });
      console.log(this.hardware);
    }
    if (event.target.id == "HardwareSelectElse") {
      this.selectedElseHardware = event.target.value;
      var sSen = this.selectedHardware;
      var sPlat = this.selectedPlatformElse;
      this.hardwareElseList = this.platformsList.find(function (element) {
        return element.id == sPlat;
      }).hardware;
      console.log(this.hardwareElseList);
      this.hardware = this.hardwareElseList.find(function (element) {
        return element.id == sSen;
      });
    }

    console.log(this.hardware);
    console.log(this.hardware.detail.type);
    this.hardwareType = this.hardware.detail.type;
    if (this.hardwareType == 'output') {
      this.angForm.controls.SensorText.setValidators([]);

    }
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
  sendCreateEvent() {
    var ifStmt = {
      "left": {
        "url": this.ifPlatformURL,
        "id": this.selectedHardware,
        "freq": this.updateFrequency
      },
      "condition": this.conditionSelect,
      "right": {
        "sensor": this.angForm.controls.SensorValue.value,
        "status": this.angForm.controls.SensorStatus.value,
        "freq": this.angForm.controls.SensorFrequency.value,
        "text": this.angForm.controls.SensorText.value
      }
    };
    var thenStmt = {
      "url": this.thenPlatformURL,
      "id": this.selectedThenHardware,
      "status": this.angForm.controls.SensorStatusThen.value,
      "freq": this.angForm.controls.SensorFrequencyThen.value,
      "text": this.angForm.controls.SensorTextThen.value
    };
    var elseStmt = {
      "url": this.elsePlatformURL,
      "id": this.selectedElseHardware,
      "status": this.angForm.controls.SensorStatusElse.value,
      "freq": this.angForm.controls.SensorFrequencyElse.value,
      "text": this.angForm.controls.SensorTextElse.value
    };
    var create = {
      "if": ifStmt,
      "then": thenStmt,
      "else": elseStmt
    };

    /*var obj = {
      "id":this.frontendID,
      "url":this.destinationPlatformURL,
      "date":this.getDate(),
      "create":create
    };*/

    this.crq.addRequest(this.frontendID, this.destinationPlatformURL, this.getDate(), create);

    this.httpClient.get("http://127.0.0.1:3000/createResponses")
      .subscribe(
        res => {
          console.log(res);
          var req = res[0];
          var responseFields: String[] = Object.values(req);
          console.log(responseFields);
          this.crp.addRequest(responseFields[0], responseFields[1], responseFields[2], responseFields[3], responseFields[4]);
          if (responseFields[3] == 'OK')
            this.sendSuccess(responseFields[0], responseFields[1]);
          else if (responseFields[3] == 'ERROR')
            this.sendError(responseFields[0], responseFields[1]);
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
