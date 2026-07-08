export * from '../db/schema';

export type ChatRequest = {
  vendorId: string;
  message: string;
  conversationId?: string;
};

export type ChatResponse = {
  message: string;
  conversationId: string;
};

export type ApprovalPayload = {
  approvalRequired: true;
  action: string;
  payload: any;
  summary: string;
};

export type ToolCallResult = {
  success: boolean;
  data?: any;
  error?: string;
  approvalPayload?: ApprovalPayload;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type RevenueBreakdown = {
  total: number;
  byPaymentMethod: Record<string, number>;
  byService: Record<string, number>;
};
