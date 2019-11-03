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
import Event from '../event-create/classes/event';
import { DeleteEventRequestService } from '../services/delete-event-request.service';
import { DeleteEventResponseService } from '../services/delete-event-response.service';
import DeleteResponse from './classes/deleteResponse';

@Component({
  selector: 'app-event-delete',
  templateUrl: './event-delete.component.html',
  styleUrls: ['./event-delete.component.css']
})
export class EventDeleteComponent implements OnInit {

  angForm: FormGroup;
  frontendID = myGlobal.FrontendName;
  frontendURL = myGlobal.FrontendIP;

  eventsList = [];
  eventsUrlList = [];

  selectedEvent = "";
  selectedUrl = "";
  eventUpdateID = "";

  selectedPlatform = "";
  selectedPlatformIf = "";
  selectedPlatformThen = "";
  selectedPlatformElse = "";

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
  updateFrequency = "";

  conditionSelect = "=";

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private eventsrv: EventService, private toastr: ToastrService, private dreqs: DeleteEventRequestService, private dress: DeleteEventResponseService) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }


  createForm() {
    this.angForm = this.fb.group({
      EventSelection: [null, Validators.required],
      EventPlatformSelect: [null,],
      FrontendID: { value: '', disabled: true },
      DestinationPlatformURL: { value: 'ok', disabled: true },
      PlatformSelect: { value: '', disabled: true },
      HardwareSelect: { value: '', disabled: true },
      PlatformURL: { value: '', disabled: true },
      UpdateFrequency: { value: '', disabled: true },
      ConditionSelect: { value: 'Equal', disabled: true },
      SensorValue: { value: '', disabled: true },
      SensorStatus: { value: '', disabled: true },
      SensorFrequency: { value: '', disabled: true },
      SensorText: { value: '', disabled: true },
      PlatformSelectThen: { value: '', disabled: true },
      HardwareSelectThen: { value: '', disabled: true },
      SensorStatusThen: { value: '', disabled: true },
      SensorFrequencyThen: { value: '', disabled: true },
      SensorTextThen: { value: '', disabled: true },
      PlatformSelectElse: { value: '', disabled: true },
      HardwareSelectElse: { value: '', disabled: true },
      SensorStatusElse: { value: '', disabled: true },
      SensorFrequencyElse: { value: '', disabled: true },
      SensorTextElse: { value: '', disabled: true }


    });
  }

  getList() {
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

  changeSelectedEvent(event: any) {
    console.log(event.target.id);

    this.selectedEvent = event.target.value;

    console.log(this.eventsList);

    this.eventsUrlList = [];

    for (let ev of this.eventsList) {
      if (ev.idEvento == event.target.value)
        this.eventsUrlList.push(ev.url);
    }

    if (this.eventsUrlList.length > 1) {
      this.angForm.controls.EventPlatformSelect.setValidators([Validators.required]);
    } else {
      this.angForm.controls.EventPlatformSelect.clearValidators();
    }

    if (this.eventsUrlList.length == 1) {
      let sE = this.selectedEvent;
      var ev = this.eventsList.find(function (element) {
        if (element.idEvento == sE)
          return element._id;
      });
      console.log(ev._id);
      this.updateForm(ev._id);
    }
  }

  changeSelectedEventPlatform(event: any) {
    console.log(event.target.value);
    this.selectedUrl = event.target.value;
    let eventID;

    for (let ev of this.eventsList) {
      console.log(ev);
      if (ev.idEvento == this.selectedEvent && ev.url == this.selectedUrl)
        eventID = ev._id;
    }
    console.log(eventID);
    this.updateForm(eventID);
  }

  updateForm(eventID){
    this.eventUpdateID = eventID;
    var ev = this.eventsList.find(function (element) {
      if (element._id == eventID)
        return element._id;
    });
    this.selectedUrl = ev.url
    console.log(this.selectedUrl);
    this.ifPlatformURL = ev.event.if.left.url;
    this.selectedHardware = ev.event.if.left.id;
    this.updateFrequency = ev.event.if.left.freq;

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
  }

  sendDeleteEvent(){
    console.log(this.eventUpdateID);
    //TODO guardar request de delete event
    let date = this.getDate();
    this.dreqs.addRequest(this.frontendID,this.frontendURL, date, this.selectedEvent);
    //TODO guardar response de delete event
    let obj = {
      'id':this.frontendID,
      'url':this.frontendURL,
      'date':date,
      'delete':{
        'id':this.selectedEvent
      }
    };
    //this.dress.addRequest('testingPT','1.0.0.1','heelo','ok');
    this.httpClient.post(`http://${this.selectedUrl}/delete`,obj).subscribe(
      res =>{
        let req = res as DeleteResponse;    
        this.dress.addRequest(req.id,req.url, req.date,req.status);
        if(req.status.toLowerCase() == 'ok')
          this.eventsrv.deleteEvent(this.eventUpdateID);    
      }
    );
    
  }

  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }
}
