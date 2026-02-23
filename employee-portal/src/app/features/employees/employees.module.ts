import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared/shared.module';

import { employeesReducer } from '../../store/employees/employees.reducer';
import { EmployeesEffects } from '../../store/employees/employees.effects';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeFormComponent },
  { path: ':id', component: EmployeeDetailComponent },
  { path: ':id/edit', component: EmployeeFormComponent },
];

@NgModule({
  declarations: [EmployeeListComponent, EmployeeDetailComponent, EmployeeFormComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('employees', employeesReducer),
    EffectsModule.forFeature([EmployeesEffects]),
  ],
})
export class EmployeesModule {}
