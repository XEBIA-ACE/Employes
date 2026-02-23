import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Employee } from '../../features/employees/models/employee.model';
import * as EmployeeActions from './employees.actions';

export interface EmployeesState extends EntityState<Employee> {
  selectedEmployeeId: string | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
}

export const adapter: EntityAdapter<Employee> = createEntityAdapter<Employee>({
  selectId: (employee) => employee.id,
  sortComparer: (a, b) => a.lastName.localeCompare(b.lastName),
});

const initialState: EmployeesState = adapter.getInitialState({
  selectedEmployeeId: null,
  isLoading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

export const employeesReducer = createReducer(
  initialState,

  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(EmployeeActions.loadEmployeesSuccess, (state, { employees, total }) =>
    adapter.setAll(employees, {
      ...state,
      isLoading: false,
      total,
    }),
  ),

  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(EmployeeActions.loadEmployeeById, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(EmployeeActions.loadEmployeeByIdSuccess, (state, { employee }) =>
    adapter.upsertOne(employee, {
      ...state,
      isLoading: false,
      selectedEmployeeId: employee.id,
    }),
  ),

  on(EmployeeActions.loadEmployeeByIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    adapter.addOne(employee, { ...state, total: state.total + 1 }),
  ),

  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    adapter.updateOne({ id: employee.id, changes: employee }, state),
  ),

  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, total: state.total - 1 }),
  ),

  on(EmployeeActions.selectEmployee, (state, { id }) => ({
    ...state,
    selectedEmployeeId: id,
  })),

  on(EmployeeActions.clearSelectedEmployee, (state) => ({
    ...state,
    selectedEmployeeId: null,
  })),
);

// Export entity selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
