import { createAction, props } from '@ngrx/store';
import { Payslip } from '../../features/payroll/models/payroll.model';

export const loadPayslips = createAction('[Payroll] Load Payslips');

export const loadPayslipsSuccess = createAction(
  '[Payroll] Load Payslips Success',
  props<{ payslips: Payslip[] }>(),
);

export const loadPayslipsFailure = createAction(
  '[Payroll] Load Payslips Failure',
  props<{ error: string }>(),
);

export const selectPayslip = createAction(
  '[Payroll] Select Payslip',
  props<{ id: string }>(),
);
