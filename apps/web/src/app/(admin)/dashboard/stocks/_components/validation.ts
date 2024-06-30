import * as z from 'zod';

export const stockSchema = z.object({
  productId: z.string().nonempty('Product is required'),
  storeId: z.string().nonempty('Store is required'),
  amount: z.number().min(1, 'Amount must be greater than zero').refine((val) => val > 0, {
    message: 'Please fill the amount',
  }),
  description: z.string().optional(),
});

export const editStockSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than zero').refine((val) => val > 0, {
    message: 'Please fill the amount',
  }),
  description: z.string().optional(),
  mutationType: z.enum(['STOCK_IN', 'STOCK_OUT']),
});
