import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { tap, map, filter } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";


import { InfoResponseService } from '../services/inforesponse.service';

import InfoResponse from '../info-request/classes/InfoResponse';
import Hardware from '../info-request/classes/Hardware';
import InfoRequest from '../info-request/classes/InfoRequest';
import SearchRequest from './classes/SearchRequest';
import { SearchRequestService } from '../services/searchrequest.service';
import SearchDetails from './classes/SearchDetails';
import SearchResponse from './classes/SearchResponse';
import DataEntry from './classes/DataEntry';
import { SearchresponseService } from '../services/searchresponse.service';


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
  requestsHardware: string[] = [];
  infoResponses = [];
  selectedPlatform = "";
  selectedSensor = "Select a Hardware";
  platformHardware = [];
  

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irp : InfoResponseService, private srs: SearchRequestService, private srpns:SearchresponseService) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  changeSelected(event: any){

    var selectedPlt = event.target.value;
    console.log(event.target.value);
    console.log(this.infoResponses.find(function(element){
      return element.id == selectedPlt;
    }));
    let hardware = this.infoResponses.find(function(element){
      return element.id == selectedPlt;
    }).hardware;
    console.log(hardware.length);
    this.selectedSensor = "Select a Hardware";
    this.requestsHardware = [];
    for(let i = 0; i<hardware.length;i++){
      this.requestsHardware.push(hardware[i]);
    }
  }

  changeSelectedHw(event : any){
    this.selectedSensor = event.target.value;
  }
  createForm() {
    this.angForm = this.fb.group({
      FrontendID: ['', Validators.required],
      PlatformURL: [{ value: '192.168.0.1', disabled: false }],
      RequestDateTime: [{ value: this.getDate(), disabled: true }],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: [null, Validators.required],
      DateStart: ['', Validators.required],
      TimeStart: ['',Validators.required],
      DateEnd: ['',Validators.required],
      TimeEnd: ['',Validators.required]
    });
  }

  getList() {
    //TODO make a server call to local, parse the hardware ids
    this.irp.getRequests().subscribe(
      res =>{
        var obj = JSON.stringify(res);
        var json = JSON.parse(obj);
        json.forEach(element => {

          var info:InfoResponse =new InfoResponse(element.id, element.url, element.date, element.hardware);
          
          //console.log(info);
          this.infoResponses.push(info);

        });
        console.log(this.infoResponses);
      }
    );
  }

  getPlatforms(){
    console.log(this.infoResponses.slice().length);
    
    var result = this.infoResponses.slice().filter(obj => {
      return obj.id == "PT_CC8Project001-1";
    })
    console.log(result);
  }
  getDate(): string {
    var currDate = new Date();
    return currDate.toISOString();
  }
  sendPostRequest(frontendID:string, platformURL: string, reqDT:string, 
                startYear: number, startMonth: number, startDay:number,
                startHour: number, startMinute: number, startSecond:number,
                endYear: number, endMonth: number, endDay: number,
                endHour: number, endMinute: number, endSecond:number
                ) {
    console.log(frontendID);
    console.log(platformURL);
    console.log(this.getDate());
    console.log(this.selectedSensor);
  
    var startDate = new Date(startYear,startMonth-1,startDay,startHour,startMinute,startSecond);
    console.log(startDate.toISOString());
    var endDate = new Date(endYear,endMonth-1,endDay,endHour,endMinute,endSecond);
    
    var sDet = new SearchDetails(this.selectedSensor,startDate.toISOString(),endDate.toISOString());
    var sReq = new SearchRequest(
      frontendID,
      platformURL,
      this.getDate(),
      new SearchDetails(this.selectedSensor,startDate.toISOString(),endDate.toISOString())
    );
    
    console.log(sDet.id_hardware);
    console.log(sReq);
    this.srs.addRequest(frontendID,platformURL,this.getDate(),sDet);


    this.httpClient.get<SearchResponse[]>("http://127.0.0.1:3000/searchResponse")
    //.pipe(map((reqs: SearchResponse[])=> reqs.map(res => new SearchResponse(res.id, res.url, res.date, res.search,res.data))))
    .subscribe(
      (res: SearchResponse[]) =>{
        console.log(res);
        for (let req of res){
          var data: DataEntry[] = new Array();

          if(req && req.data){
            var ids: string[] = Object.keys(req.data);
            var vals: Object[] = Object.values(req.data);

            for(let i = 0; i<ids.length; i++){
              var dataDates: string[] = Object.values(vals[i]);
              var dataEntries: DataEntry = new DataEntry(ids[i],parseInt( dataDates[0]),Boolean(dataDates[1]),parseInt(dataDates[2]),dataDates[3]);
              data.push(dataEntries);
            }
            console.log(data);
          }
          req.data = data;
        }
        console.log(res);
        //TODO push the response here
        this.srpns.addRequest(res[0].id,res[0].url, res[0].date, res[0].search, res[0].data);
      }
    );
    //console.log(this.dateStart.year);
    
    //FrontendID, PlatformURL, RequestDateTime, request.id, DateStart,TimeStart,DateEnd,TimeEnd
    
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
