import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule }        from '@angular/material/toolbar';
import { MatButtonModule }         from '@angular/material/button';
import { MatIconModule }           from '@angular/material/icon';
import { MatMenuModule }           from '@angular/material/menu';
import { MatListModule }           from '@angular/material/list';
import { MatDividerModule }        from '@angular/material/divider';
import { MatSidenavModule }        from '@angular/material/sidenav';
import { MatCardModule }           from '@angular/material/card';
import { MatTableModule }          from '@angular/material/table';
import { MatPaginatorModule }      from '@angular/material/paginator';
import { MatSortModule }           from '@angular/material/sort';
import { MatInputModule }          from '@angular/material/input';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { MatSelectModule }         from '@angular/material/select';
import { MatDatepickerModule }     from '@angular/material/datepicker';
import { MatNativeDateModule }     from '@angular/material/core';
import { MatDialogModule }         from '@angular/material/dialog';
import { MatSnackBarModule }       from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule }    from '@angular/material/progress-bar';
import { MatChipsModule }          from '@angular/material/chips';
import { MatBadgeModule }          from '@angular/material/badge';
import { MatTooltipModule }        from '@angular/material/tooltip';
import { MatCheckboxModule }       from '@angular/material/checkbox';
import { MatRadioModule }          from '@angular/material/radio';
import { MatTabsModule }           from '@angular/material/tabs';
import { MatStepperModule }        from '@angular/material/stepper';
import { MatAutocompleteModule }   from '@angular/material/autocomplete';

// Components
import { HeaderComponent }              from './components/header/header.component';
import { SidebarComponent }             from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent }      from './components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent }  from './components/confirmation-dialog/confirmation-dialog.component';

// Pipes
import { InitialsPipe }           from './pipes/initials.pipe';
import { LeaveStatusPipe }        from './pipes/leave-status.pipe';
import { EmploymentStatusPipe }   from './pipes/employment-status.pipe';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';

const MATERIAL_MODULES = [
  MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
  MatListModule, MatDividerModule, MatSidenavModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,
  MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule,
  MatChipsModule, MatBadgeModule, MatTooltipModule, MatCheckboxModule,
  MatRadioModule, MatTabsModule, MatStepperModule, MatAutocompleteModule,
];

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  LoadingSpinnerComponent,
  ConfirmationDialogComponent,
];

const PIPES = [InitialsPipe, LeaveStatusPipe, EmploymentStatusPipe];
const DIRECTIVES = [HasRoleDirective];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    // Modules
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...MATERIAL_MODULES,
    // Components / Pipes / Directives
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
