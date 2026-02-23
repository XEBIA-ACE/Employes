import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Payslip } from '../../features/payroll/models/payroll.model';
import * as PayrollActions from './payroll.actions';

export interface PayrollState extends EntityState<Payslip> {
  isLoading: boolean;
  error: string | null;
  currentPayslipId: string | null;
}

const adapter: EntityAdapter<Payslip> = createEntityAdapter<Payslip>({
  selectId: (payslip) => payslip.id,
  sortComparer: (a, b) => new Date(b.payPeriodEnd).getTime() - new Date(a.payPeriodEnd).getTime(),
});

const initialState: PayrollState = adapter.getInitialState({
  isLoading: false,
  error: null,
  currentPayslipId: null,
});

export const payrollReducer = createReducer(
  initialState,

  on(PayrollActions.loadPayslips, (state) => ({ ...state, isLoading: true, error: null })),

  on(PayrollActions.loadPayslipsSuccess, (state, { payslips }) =>
    adapter.setAll(payslips, { ...state, isLoading: false }),
  ),

  on(PayrollActions.loadPayslipsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(PayrollActions.selectPayslip, (state, { id }) => ({
    ...state,
    currentPayslipId: id,
  })),
);

export const { selectAll: selectAllPayslips } = adapter.getSelectors();
