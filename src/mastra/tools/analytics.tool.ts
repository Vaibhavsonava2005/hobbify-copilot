import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const getConversionRateTool = createTool({
  id: 'get_conversion_rate',
  description: 'Get trial to paid conversion rate',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    return { success: true, data: { conversionRate: '15.5%' } };
  }
});

export const getMonthlyComparisonTool = createTool({
  id: 'get_monthly_comparison',
  description: 'Compare current month metrics with previous month',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    return { 
      success: true, 
      data: { 
        revenueGrowth: '12%',
        userGrowth: '5%',
        churnRate: '2%'
      } 
    };
  }
});
