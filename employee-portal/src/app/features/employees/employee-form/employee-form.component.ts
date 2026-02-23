import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, forkJoin, finalize } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Department, Position, EmploymentType } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  departments: Department[] = [];
  positions:   Position[]   = [];
  filteredPositions: Position[] = [];

  isEditing  = false;
  employeeId = '';
  isLoading  = false;
  isSaving   = false;

  readonly employmentTypes: { value: EmploymentType; label: string }[] = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract',  label: 'Contract' },
    { value: 'intern',    label: 'Intern' },
  ];

  readonly genderOptions = [
    { value: 'male',              label: 'Male' },
    { value: 'female',            label: 'Female' },
    { value: 'other',             label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.employeeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEditing  = !!this.employeeId && this.employeeId !== 'new';

    this.isLoading = true;

    forkJoin({
      departments: this.employeeService.getDepartments(),
      positions:   this.employeeService.getPositions(),
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ departments, positions }) => {
        this.departments = departments;
        this.positions   = positions;

        if (this.isEditing) {
          this.loadEmployee();
        } else {
          this.isLoading = false;
        }
      },
    });

    // When department changes, filter positions
    this.form.get('departmentId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(deptId => {
        this.filteredPositions = this.positions.filter(p => p.departmentId === deptId);
        this.form.get('positionId')?.reset();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      // Personal
      firstName:      ['', [Validators.required, Validators.minLength(2)]],
      lastName:       ['', [Validators.required, Validators.minLength(2)]],
      email:          ['', [Validators.required, Validators.email]],
      phone:          [''],
      dateOfBirth:    [null],
      gender:         [''],

      // Employment
      departmentId:   ['', Validators.required],
      positionId:     ['', Validators.required],
      managerId:      [''],
      employmentType: ['full_time', Validators.required],
      hireDate:       [null, Validators.required],
      salary:         [null, [Validators.min(0)]],
      currency:       ['USD'],

      // Address
      address: this.fb.group({
        street:     [''],
        city:       [''],
        state:      [''],
        postalCode: [''],
        country:    [''],
      }),

      // Emergency Contact
      emergencyContact: this.fb.group({
        name:         [''],
        relationship: [''],
        phone:        [''],
        email:        [''],
      }),
    });
  }

  private loadEmployee(): void {
    this.employeeService
      .getEmployee(this.employeeId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: emp => {
          this.filteredPositions = this.positions.filter(p => p.departmentId === emp.departmentId);
          this.form.patchValue(emp);
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) return;

    this.isSaving = true;
    const payload = this.form.value;

    const request$ = this.isEditing
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.createEmployee(payload);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isSaving = false)),
      )
      .subscribe({
        next: emp => {
          const action = this.isEditing ? 'updated' : 'created';
          this.notification.success(`Employee ${action} successfully.`);
          this.router.navigate(['/employees', emp.id]);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
