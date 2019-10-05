import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangeRequestComponent } from './change-request/change-request.component';
import { InfoRequestComponent } from './info-request/info-request.component';
import { SearchRequestComponent } from './search-request/search-request.component';
import { ChangeRequestService } from './services/changerequest.service';
import { InforequestService } from './services/inforequest.service';
import { InfoResponseService } from './services/inforesponse.service';
import { SearchRequestService } from './services/searchrequest.service';
import { SearchresponseService } from './services/searchresponse.service';



@NgModule({
  declarations: [
    AppComponent,
    InfoRequestComponent,
    SearchRequestComponent,
    ChangeRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ 
    InforequestService,
    InfoResponseService,
    SearchRequestService,
    SearchresponseService,
    ChangeRequestService 
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
