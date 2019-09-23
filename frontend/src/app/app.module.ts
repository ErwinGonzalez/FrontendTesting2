import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoRequestComponent } from './info-request/info-request.component';
import InfoRequest from './info-request/classes/InfoRequest';
import { InforequestService } from './services/inforequest.service';
import { InfoResponseService } from './services/inforesponse.service';
import { SearchRequestComponent } from './search-request/search-request.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoRequestComponent,
    SearchRequestComponent
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
    InfoResponseService 
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
