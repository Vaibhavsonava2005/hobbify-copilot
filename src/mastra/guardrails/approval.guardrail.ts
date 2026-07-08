import { ApprovalPayload } from '../../types';

export const isApprovalRequired = (response: any): response is { approvalPayload: ApprovalPayload } => {
  return response && typeof response === 'object' && 'approvalPayload' in response;
};
