import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ChangeRequestComponent } from './change-request/change-request.component';
import { InfoRequestComponent } from './info-request/info-request.component';
import { SearchRequestComponent } from './search-request/search-request.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventUpdateComponent } from './event-update/event-update.component';

import { ChangeRequestService } from './services/changerequest.service';
import { InforequestService } from './services/inforequest.service';
import { InfoResponseService } from './services/inforesponse.service';
import { SearchRequestService } from './services/searchrequest.service';
import { SearchresponseService } from './services/searchresponse.service';
import { CreateresponseService } from './services/createresponse.service';
import { CreaterequestService } from './services/createrequest.service';




@NgModule({
  declarations: [
    AppComponent,
    InfoRequestComponent,
    SearchRequestComponent,
    ChangeRequestComponent,
    EventCreateComponent,
    EventUpdateComponent,
    EventUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    InforequestService,
    InfoResponseService,
    SearchRequestService,
    SearchresponseService,
    ChangeRequestService,
    CreateresponseService,
    CreaterequestService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
