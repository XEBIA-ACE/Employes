import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LeaveListComponent }    from './leave-list/leave-list.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';

const routes: Routes = [
  { path: '',          redirectTo: 'my-leaves', pathMatch: 'full' },
  { path: 'my-leaves', component: LeaveListComponent },
  { path: 'request',   component: LeaveRequestComponent },
];

@NgModule({
  declarations: [LeaveListComponent, LeaveRequestComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class LeaveModule {}
