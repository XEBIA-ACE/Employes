import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { environment } from '../../../environments/environment';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const mockEmployee: Employee = {
    id: 'emp-1',
    employeeId: 'EMP-0001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    departmentId: 'dept-1',
    positionId: 'pos-1',
    employmentType: 'full_time',
    employmentStatus: 'active',
    hireDate: new Date('2022-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedResponse = {
    data: [mockEmployee],
    pagination: {
      page: 1, pageSize: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });
    service  = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch employees list', () => {
    service.getEmployees({ page: 1, pageSize: 10 }).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].firstName).toBe('John');
      expect(res.pagination.total).toBe(1);
    });

    const req = httpMock.expectOne(r => r.url === `${environment.apiUrl}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should fetch single employee', () => {
    service.getEmployee('emp-1').subscribe(emp => {
      expect(emp.id).toBe('emp-1');
      expect(emp.fullName).toBeUndefined(); // not computed yet
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/employees/emp-1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockEmployee, timestamp: new Date().toISOString() });
  });

  it('should delete an employee', () => {
    service.deleteEmployee('emp-1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/employees/emp-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should include search param in request', () => {
    service.getEmployees({ search: 'John' }).subscribe();

    const req = httpMock.expectOne(r =>
      r.url === `${environment.apiUrl}/employees` &&
      r.params.get('search') === 'John',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });
});
