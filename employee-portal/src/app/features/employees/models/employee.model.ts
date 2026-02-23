/**
 * Employee employment type
 */
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';

/**
 * Employee status
 */
export type EmployeeStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';

/**
 * Employee gender
 */
export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

/**
 * Complete employee entity as returned from the API
 */
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  gender: Gender;
  dateOfBirth: string;
  nationalId?: string;

  // Employment
  department: string;
  position: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: string;
  terminationDate?: string;
  managerId?: string;
  managerName?: string;

  // Contact & Location
  address?: Address;
  emergencyContact?: EmergencyContact;

  // Compensation
  baseSalary: number;
  currency: string;

  // Media
  avatarUrl?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

/**
 * DTO for creating a new employee
 */
export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: Gender;
  dateOfBirth: string;
  nationalId?: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  hireDate: string;
  managerId?: string;
  baseSalary: number;
  currency?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

/**
 * DTO for updating an existing employee (all fields optional)
 */
export type UpdateEmployeeDto = Partial<CreateEmployeeDto> & {
  status?: EmployeeStatus;
};

/**
 * Summary view of an employee (used in lists)
 */
export interface EmployeeSummary {
  id: string;
  employeeNumber: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  hireDate: string;
}
