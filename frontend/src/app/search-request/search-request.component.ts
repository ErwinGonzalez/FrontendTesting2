import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as CanvasJS from '../../assets/canvasjs.min';
import InfoResponse from '../info-request/classes/InfoResponse';
import { InfoResponseService } from '../services/inforesponse.service';
import { SearchRequestService } from '../services/searchrequest.service';
import { SearchresponseService } from '../services/searchresponse.service';
import { ToastrService } from 'ngx-toastr';

import DataEntry from './classes/DataEntry';
import SearchDetails from './classes/SearchDetails';
import SearchRequest from './classes/SearchRequest';
import SearchResponse from './classes/SearchResponse';

@Component({
  selector: 'app-search-request',
  templateUrl: './search-request.component.html',
  styleUrls: ['./search-request.component.css']
})
export class SearchRequestComponent implements OnInit {

  angForm: FormGroup;
  apiAdd: "http://localhost:3000/";
  requestsHardware: string[] = [];
  infoResponses = [];
  selectedPlatform = "";
  platURL = "192.165.0.1";
  frontendID = "CCVIII-FE";
  selectedSensor = "Select a Hardware";
  platformHardware = [];
  frontendURL="192.168.1.14";


  constructor(private fb: FormBuilder, private httpClient: HttpClient, private irp: InfoResponseService, private srs: SearchRequestService, private srpns: SearchresponseService, private toastr: ToastrService) { }

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  changeSelected(event: any) {

    var selectedPlt = event.target.value;
    console.log(event.target.value);
    var selected = this.infoResponses.find(function (element) {
      return element.id == selectedPlt;
    });
    let hardware = selected.hardware;
    this.platURL = selected.url;
    console.log(hardware.length);
    console.log(this.platURL);
    this.selectedSensor = "Select a Hardware";
    this.requestsHardware = [];
    for (let i = 0; i < hardware.length; i++) {
      this.requestsHardware.push(hardware[i]);
    }
  }

  changeSelectedHw(event: any) {
    console.log(event.target.value);
    this.selectedSensor = event.target.value;
  }
  createForm() {
    this.angForm = this.fb.group({
      FrontendID: [this.frontendID, Validators.required],
      PlatformURL: [{ value: null, disabled: true }],
      RequestDateTime: [{ value: this.getDate(), disabled: true }],
      PlatformSelect: [null, Validators.required],
      HardwareSelect: [null, Validators.required],
      DateStart: [null, Validators.required],
      TimeStart: [null, Validators.required],
      DateEnd: [null, Validators.required],
      TimeEnd: [null, Validators.required]
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

  getPlatforms() {
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
  sendPostRequest() {
    var frontendID = this.angForm.controls.FrontendID.value;
    var platformURL = this.platURL;
    console.log(frontendID);
    console.log(platformURL);
    console.log(this.getDate());
    console.log(this.selectedSensor);
    var startDate: NgbDateStruct = this.angForm.controls.DateStart.value;
    var endDate: NgbDateStruct = this.angForm.controls.DateEnd.value
    var startTime: NgbTimeStruct = this.angForm.controls.TimeStart.value;
    var endTime: NgbTimeStruct = this.angForm.controls.TimeEnd.value;
    console.log(startDate);


    var sDate = new Date(startDate.year, startDate.month, startDate.day, startTime.hour, startTime.minute, startTime.second);
    var eDate = new Date(endDate.year, endDate.month, endDate.day, endTime.hour, endTime.minute, endTime.second);
    var sDet = new SearchDetails(this.selectedSensor, sDate.toISOString(), eDate.toISOString());
    var sReq = new SearchRequest(
      frontendID,
      this.frontendURL,
      this.getDate(),
      new SearchDetails(this.selectedSensor, sDate.toISOString(), eDate.toISOString())
    );

    console.log(sDet.id_hardware);
    console.log(sReq);
    this.srs.addRequest(frontendID, this.frontendURL, this.getDate(), sDet);


    var obj = {
      "id": frontendID,
      "url": this.frontendURL,
      "date": this.getDate(),
      "search":{
        "id_hardware": this.selectedSensor,
        "start_date": sDate.toISOString(),
        "finish_date": eDate.toISOString()
      }
    };
    this.httpClient.post(`http://${platformURL}/search`,obj)
    //this.httpClient.get("http://127.0.0.1:3000/searchResponse")
      //.pipe(map((reqs: SearchResponse[])=> reqs.map(res => new SearchResponse(res.id, res.url, res.date, res.search,res.data))))
      .subscribe(
        res => {
          console.log(res);
          //var req = res[0];
          let req = res as SearchResponse;
          var dataA: DataEntry[] = new Array();
          console.log(req);
          console.log(req.id);
          console.log(Object.keys(req));
          var fields: Object[] = Object.values(req);
          var test = new SearchResponse(fields[0].toString(), fields[1].toString(), fields[2].toString(), fields[3], fields[4]);
          console.log(test);
          if (test && test.data) {
            var ids: string[] = Object.keys(test.data);
            var vals: Object[] = Object.values(test.data);

            for (let i = 0; i < ids.length; i++) {
              var dataDates: string[] = Object.values(vals[i]);
              var dataEntries: DataEntry = new DataEntry(ids[i], parseInt(dataDates[0]), Boolean(dataDates[1]), parseInt(dataDates[2]), dataDates[3]);
              dataA.push(dataEntries);
            }
            console.log(dataA);
          }
          req.data = dataA;
          test.data = dataA;
          var values: number[] = [];
          for (let d of dataA) {
            if (!isNaN(d.sensor))
              values.push(d.sensor);
          }
          console.log(Math.max.apply(null, values));
          console.log(req);
          console.log(req.data);

          let dataPoints = [];
          var end = 1;
          var top = 100;
          var min = Math.min.apply(null, values);
          var max = Math.max.apply(null, values);


          for (let i = 0; i < values.length; i++) {
            var normValue = end + (values[i] - min) * (top - end) / (max - min);
            dataPoints.push({ x: new Date(dataA[i].id), y: normValue });

          }
          console.log(dataPoints);

          var chart = new CanvasJS.Chart("chartContainer",
            {
              zoomEnabled: true,

              title: {
                text: "Sensor values over Time"
              },

              data: [
                {
                  type: "area",
                  xValueType: "dateTime",
                  dataPoints: dataPoints

                }]
            });

          chart.render();

          this.srpns.addRequest(test.id, test.url, test.date, test.search, test.data);
          this.showSuccess(test.id, test.url, test.data.length);
        }
      );
  }
  showSuccess(platID: string, platURL: string, platResponseLenght: number) {
    this.toastr.success(`${platID} with URL ${platURL} sent ${platResponseLenght} data points`, "Response from platform saved!");
  }
}
