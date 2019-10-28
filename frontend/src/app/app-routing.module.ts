import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoRequestComponent } from './info-request/info-request.component';
import { SearchRequestComponent } from './search-request/search-request.component';
import { ChangeRequestComponent } from './change-request/change-request.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventUpdateComponent } from './event-update/event-update.component';

const routes: Routes = [
  { path: 'info', component: InfoRequestComponent },
  { path: 'search', component: SearchRequestComponent},
  { path: 'change', component: ChangeRequestComponent},
  { path: 'create', component: EventCreateComponent},
  { path: 'update', component: EventUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
