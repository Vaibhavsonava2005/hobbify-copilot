import { ApprovalPayload } from '../../types/index.js';

export const isApprovalRequired = (response: any): response is { approvalPayload: ApprovalPayload } => {
  return response && typeof response === 'object' && 'approvalPayload' in response;
};
