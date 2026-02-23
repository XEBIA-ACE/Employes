import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeListComponent }   from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeFormComponent }   from './employee-form/employee-form.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '',                component: EmployeeListComponent,   canActivate: [RoleGuard], data: { roles: ['admin', 'hr', 'manager'] } },
  { path: 'new',             component: EmployeeFormComponent,   canActivate: [RoleGuard], data: { roles: ['admin', 'hr'] } },
  { path: ':id',             component: EmployeeDetailComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'hr', 'manager'] } },
  { path: ':id/edit',        component: EmployeeFormComponent,   canActivate: [RoleGuard], data: { roles: ['admin', 'hr'] } },
];

@NgModule({
  declarations: [EmployeeListComponent, EmployeeDetailComponent, EmployeeFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class EmployeesModule {}
