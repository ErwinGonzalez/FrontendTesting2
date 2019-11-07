import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../services/events.service';
import * as myGlobal from '../globals';
import Event from '../event-create/classes/event';
import InfoResponse from '../info-request/classes/InfoResponse';
import { InfoResponseService } from '../services/inforesponse.service';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {

  angForm: FormGroup;
  frontendID = myGlobal.FrontendName;
  frontendURL = myGlobal.FrontendIP;

  eventsList = [];
  platformsList = [];
  destinationPlatformURL = "";
  eventUpdateID = "";
  selectedEvent;

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

  sensorValueRight;
  sensorStatusRight;
  sensorFrequencyRight;
  sensorTextRight;

  sensorStatusThen;
  sensorFrequencyThen;
  sensorTextThen;

  sensorStatusElse;
  sensorFrequencyElse;
  sensorTextElse;


  ifPlatformURL = "";
  thenPlatformURL = "";
  elsePlatformURL = "";
  updateFrequency : number = 0;


  conditionSelect = "=";

  constructor(private fb: FormBuilder, private eventsrv: EventService, private irp: InfoResponseService) { }

  ngOnInit() {
    this.createForm();
    console.log(this.angForm.controls.ConditionSelect.value)
    this.getEventsList();
    this.getPlatformsList();
  }
  createForm() {
    this.angForm = this.fb.group({
      EventSelection: [null, Validators.required],
      FrontendID: [this.frontendID, Validators.required],
      DestinationPlatformURL: [{ value: '', disabled: true }, Validators.required],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: ['-1', [Validators.required, Validators.min(0)]],
      PlatformURL: [{ value: this.ifPlatformURL, disabled: true }, Validators.required],
      UpdateFrequency: [0, [Validators.required,Validators.min(0), Validators.pattern("^[0-9]*$")]],
      ConditionSelect: ['Equal', Validators.required],
      SensorValue: [0],
      SensorStatus: [''],
      SensorFrequency: [0],
      SensorText: [''],
      SensorStatusThen: [''],
      SensorFrequencyThen: [0],
      SensorTextThen: [''],
      PlatformSelectThen: [null, Validators.required],
      HardwareSelectThen: ['-1', [Validators.required, Validators.min(0)]],
      SensorStatusElse: [''],
      SensorFrequencyElse: [0],
      SensorTextElse: [''],
      PlatformSelectElse: [null, Validators.required],
      HardwareSelectElse: ['-1', [Validators.required, Validators.min(0)]]
    });
  }

  getEventsList() {
    this.eventsrv.getRequests().subscribe(
      res => {
        var obj = JSON.stringify(res);
        var json = JSON.parse(obj);
        json.forEach(element => {
          var event: Event = new Event(element._id, element.id, element.url, element.date, element.idEvento, element.event);
          //console.log(info);
          this.eventsList.push(event);


        });
        console.log(this.eventsList)
      }
    );
  }
  getPlatformsList() {
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
    
    if (event.target.id == "DestinationPlatformSelect") {
      this.destinationPlatformURL = selected.url;
      this.selectedPlatform = event.target.value;
      return;
    }
    this.getSelectedHardware(event.target.id, selected,'-1');
    //console.log(hardware.length);
    this.updateValidators();
    //console.log(this.platformURL);

  }
  /** 
   * @param platform Nombre del dropdown que esta siendo seleccionado
   * @param selected Item del dropdown que acaba de ser seleccionado
   * @param value Id de la plataforma
   */
  getSelectedHardware(platform, selected, hwOption){

    let hardware = selected.hardware;
    if (platform == "PlatformSelect") {
      this.ifPlatformURL = selected.url;
      this.angForm.controls.HardwareSelect.setValue(hwOption);
      this.hardware = null;
      this.hardwareType = null;
      this.hardwareList = [];
      this.selectedPlatformIf = selected.id;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareList.push(hardware[i]);
      }
      if(hwOption != '-1'){
        let selected = this.hardwareList.find(function (element) {
          return element.id == hwOption;
        });
        this.hardwareType = selected.detail.type;
      }
    }
    if (platform == "PlatformSelectThen") {
      this.thenPlatformURL = selected.url;
      this.angForm.controls.HardwareSelectThen.setValue(hwOption);
      this.hardwareThen = null;
      this.hardwareTypeThen = null;
      this.hardwareThenList = [];
      this.selectedPlatformThen = selected.id;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareThenList.push(hardware[i]);
      }
      console.log(this.hardwareThenList);
      if(hwOption != '-1'){
        let selected = this.hardwareThenList.find(function (element) {
          return element.id == hwOption;
        });
        this.hardwareTypeThen = selected.detail.type;
      }
    }
    if (platform == "PlatformSelectElse") {
      this.elsePlatformURL = selected.url;
      this.angForm.controls.HardwareSelectElse.setValue(hwOption);
      this.hardwareElse = null;
      this.hardwareTypeElse = null;
      this.hardwareElseList = [];
      this.selectedPlatformElse = selected.id;
      for (let i = 0; i < hardware.length; i++) {
        this.hardwareElseList.push(hardware[i]);
      }
      console.log(this.hardwareElseList);
      if(hwOption != '-1'){
        let selected = this.hardwareElseList.find(function (element) {
          return element.id == hwOption;
        });
        this.hardwareTypeElse = selected.detail.type;
      }
    }
  }
  changeSelectedHw(event: any) {
    //TODO verificar cual fue el dropdown que llamo
    console.log(event.target);
    console.log(event.target.id);

    if (event.target.id == "HardwareSelect") {
      this.selectedHardware = event.target.value;
      var sSen = this.selectedHardware;
      var sPlat = this.selectedPlatformIf;
      console.log(this.hardwareList)
      console.log(sPlat)
      console.log(sSen)
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

  changeSelectedEvent(event: any){
    console.log(event.target.id);
    console.log(event.target.value);
  
    this.eventUpdateID = event.target.value;
    var ev = this.eventsList.find(function (element) {
      if (element._id == event.target.value)
        return element._id;
    });
    this.selectedEvent = ev;
    this.destinationPlatformURL = ev.url
    console.log(this.destinationPlatformURL);
    this.ifPlatformURL = ev.event.if.left.url;
    this.selectedHardware = ev.event.if.left.id;
    console.log(this.ifPlatformURL)
    console.log(this.angForm.controls.PlatformURL)
    this.updateFrequency =ev.event.if.left.freq;
    this.angForm.controls.UpdateFrequency.updateValueAndValidity();
    console.log(this.angForm.controls.UpdateFrequency.errors);
    let value = ev.event.if.condition;
    if (value == "=")
      this.conditionSelect = "Equal";
    if (value == "!=")
      this.conditionSelect = "NotEqual";
    if (value == "<")
      this.conditionSelect = "LessThan";
    if (value == ">")
      this.conditionSelect = "GreaterThan";
    if (value == "=<")
      this.conditionSelect = "LessOrEqual";
    if (value == "=>")
      this.conditionSelect = "GreaterOrEqual";
    console.log(value);
    console.log(this.conditionSelect);

    
    this.sensorValueRight = ev.event.if.right.sensor;
    this.sensorStatusRight = ev.event.if.right.status;
    this.sensorFrequencyRight = ev.event.if.right.freq;
    this.sensorTextRight = ev.event.if.right.text;

    if(this.sensorFrequencyRight > 0)
      this.hardwareType = 'input'

    this.selectedPlatformThen = ev.event.then.url;
    this.selectedThenHardware = ev.event.then.id;

    this.sensorStatusThen = ev.event.then.status;
    this.sensorFrequencyThen = ev.event.then.freq;
    this.sensorTextThen = ev.event.then.text;
    if(this.sensorFrequencyThen > 0)
      this.hardwareTypeThen = 'input';

    this.selectedPlatformElse = ev.event.else.url;
    this.selectedElseHardware = ev.event.else.id;

    this.sensorStatusElse = ev.event.else.status;
    this.sensorFrequencyElse = ev.event.else.freq;
    this.sensorTextElse = ev.event.else.text;
    if(this.sensorFrequencyElse > 0)
      this.hardwareTypeElse = 'input';
    this.setSelectedPlatforms();
  }

  setSelectedPlatforms(){
    console.log(this.platformsList)
    
    let ifleftplat = this.selectedEvent.event.if.left.url;
    let ifthenplat = this.selectedEvent.event.then.url;
    let ifelseplat = this.selectedEvent.event.else.url;

    let iflefthard = this.selectedEvent.event.if.left.id;
    let ifthenhard = this.selectedEvent.event.then.id;
    let ifelsehard = this.selectedEvent.event.else.id;

    this.ifPlatformURL = ifleftplat;
    this.thenPlatformURL = ifthenplat;
    this.elsePlatformURL = ifelseplat;
   
    /** Seleccionando el valor correcto de la plataforma del if */
    var selected = this.platformsList.find(function (element) {
      return element.url == ifleftplat;
    });
    console.log(selected);
    this.angForm.controls.PlatformSelect.setValue(selected.id);
    this.getSelectedHardware("PlatformSelect",selected,iflefthard);
/** Seleccionando el valor correcto de la plataforma del then */
    selected = this.platformsList.find(function (element) {
      return element.url == ifthenplat;
    });
    console.log(selected);
    this.angForm.controls.PlatformSelectThen.setValue(selected.id);
    this.getSelectedHardware("PlatformSelectThen",selected,ifthenhard);
/** Seleccionando el valor correcto de la plataforma del else */
    selected = this.platformsList.find(function (element) {
      return element.url == ifelseplat;
    });
    console.log(selected);
    this.angForm.controls.PlatformSelectElse.setValue(selected.id);
    this.getSelectedHardware("PlatformSelectElse",selected,ifelsehard);
  }
  onValChange(value: any) {
    console.log(value);
  }

  sendUpdateEvent(){
    
  }
}
