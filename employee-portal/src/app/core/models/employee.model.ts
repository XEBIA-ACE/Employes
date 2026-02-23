export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type EmploymentType   = 'full_time' | 'part_time' | 'contract' | 'intern';
export type Gender           = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Department {
  id: string;
  name: string;
  headId?: string;
  description?: string;
  createdAt: Date;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
  level: string;
  description?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Employee {
  id: string;
  employeeId: string;       // e.g. EMP-0001
  firstName: string;
  lastName: string;
  fullName?: string;        // computed: firstName + lastName
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  avatar?: string;

  // Employment details
  departmentId: string;
  department?: Department;
  positionId: string;
  position?: Position;
  managerId?: string;
  manager?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'avatar'>;

  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  hireDate: Date;
  terminationDate?: Date;

  // Salary
  salary?: number;
  currency?: string;

  // Contact
  address?: Address;
  emergencyContact?: EmergencyContact;

  // Meta
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: string;
  status?: EmploymentStatus;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  departmentId: string;
  positionId: string;
  managerId?: string;
  employmentType: EmploymentType;
  hireDate: Date;
  salary?: number;
  currency?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest>;
