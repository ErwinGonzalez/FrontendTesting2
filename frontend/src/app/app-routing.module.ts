import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoRequestComponent } from './info-request/info-request.component';

const routes: Routes = [
  { path: 'info', component: InfoRequestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
