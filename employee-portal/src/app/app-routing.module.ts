import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

/**
 * Application root routes.
 * All feature modules are lazy-loaded for optimal bundle size.
 */
const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Authentication (eagerly loaded — needed before auth)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },

  // Protected routes — require authentication
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employees/employees.module').then((m) => m.EmployeesModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'hr_manager'] },
  },
  {
    path: 'leave',
    loadChildren: () =>
      import('./features/leave-management/leave-management.module').then(
        (m) => m.LeaveManagementModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'payroll',
    loadChildren: () =>
      import('./features/payroll/payroll.module').then((m) => m.PayrollModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },

  // Catch-all — redirect to dashboard
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
