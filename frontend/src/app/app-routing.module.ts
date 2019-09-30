import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoRequestComponent } from './info-request/info-request.component';
import { SearchRequestComponent } from './search-request/search-request.component';
import { ChangeRequestComponent } from './change-request/change-request.component';

const routes: Routes = [
  { path: 'info', component: InfoRequestComponent },
  { path: 'search', component: SearchRequestComponent},
  { path: 'change', component: ChangeRequestComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
