import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoRequestComponent } from './info-request/info-request.component';
import InfoRequest from './InfoRequest';
import { InforequestService } from './inforequest.service';

@NgModule({
  declarations: [
    AppComponent,
    InfoRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ InforequestService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
