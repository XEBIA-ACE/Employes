import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { AppState } from '../../../../store/app.state';
import {
  createEmployee,
  updateEmployee,
  loadEmployeeById,
} from '../../../../store/employees/employees.actions';
import { selectSelectedEmployee, selectEmployeesLoading } from '../../../../store/employees/employees.selectors';
import { Employee } from '../../models/employee.model';
import { SelectOption } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  isLoading = false;

  readonly departments: SelectOption[] = [
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Human Resources', value: 'Human Resources' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Operations', value: 'Operations' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Legal', value: 'Legal' },
    { label: 'Product', value: 'Product' },
  ];

  readonly employmentTypes: SelectOption[] = [
    { label: 'Full Time', value: 'full_time' },
    { label: 'Part Time', value: 'part_time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Intern', value: 'intern' },
  ];

  readonly genders: SelectOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non_binary' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.employeeId && this.route.snapshot.url.some((s) => s.path === 'edit');

    this.buildForm();

    if (this.isEditMode && this.employeeId) {
      this.store.dispatch(loadEmployeeById({ id: this.employeeId }));

      this.store
        .select(selectSelectedEmployee)
        .pipe(
          takeUntil(this.destroy$),
          filter((e): e is Employee => e !== null),
        )
        .subscribe((employee) => this.patchForm(employee));
    }

    this.store
      .select(selectEmployeesLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (this.isLoading = loading));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      // Personal Info
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationalId: [''],

      // Employment
      department: ['', Validators.required],
      position: ['', Validators.required],
      employmentType: ['full_time', Validators.required],
      hireDate: ['', Validators.required],
      managerId: [''],

      // Compensation
      baseSalary: ['', [Validators.required, Validators.min(0)]],
      currency: ['USD'],

      // Address
      street: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],

      // Emergency Contact
      emergencyName: [''],
      emergencyRelationship: [''],
      emergencyPhone: [''],
    });
  }

  private patchForm(employee: Employee): void {
    this.form.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      gender: employee.gender,
      dateOfBirth: employee.dateOfBirth,
      nationalId: employee.nationalId,
      department: employee.department,
      position: employee.position,
      employmentType: employee.employmentType,
      hireDate: employee.hireDate,
      managerId: employee.managerId,
      baseSalary: employee.baseSalary,
      currency: employee.currency,
      street: employee.address?.street,
      city: employee.address?.city,
      state: employee.address?.state,
      postalCode: employee.address?.postalCode,
      country: employee.address?.country,
      emergencyName: employee.emergencyContact?.name,
      emergencyRelationship: employee.emergencyContact?.relationship,
      emergencyPhone: employee.emergencyContact?.phone,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const dto = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone || undefined,
      gender: v.gender,
      dateOfBirth: v.dateOfBirth,
      nationalId: v.nationalId || undefined,
      department: v.department,
      position: v.position,
      employmentType: v.employmentType,
      hireDate: v.hireDate,
      managerId: v.managerId || undefined,
      baseSalary: Number(v.baseSalary),
      currency: v.currency,
      address: v.street
        ? {
            street: v.street,
            city: v.city,
            state: v.state,
            postalCode: v.postalCode,
            country: v.country,
          }
        : undefined,
      emergencyContact: v.emergencyName
        ? {
            name: v.emergencyName,
            relationship: v.emergencyRelationship,
            phone: v.emergencyPhone,
          }
        : undefined,
    };

    if (this.isEditMode && this.employeeId) {
      this.store.dispatch(updateEmployee({ id: this.employeeId, employee: dto }));
    } else {
      this.store.dispatch(createEmployee({ employee: dto }));
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
