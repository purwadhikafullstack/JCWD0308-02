import { ZodType, z } from 'zod';

export class StockValidation {
  static readonly createStock: ZodType = z.object({
    storeId: z.string().uuid(),
    productId: z.string().uuid(),
    amount: z.number().int().positive(),
    description: z.string().optional(),
  });

  static readonly updateStock: ZodType = z.object({
    amount: z.number().int().positive(),
    description: z.string().optional(),
    mutationType: z.enum(["STOCK_IN", "STOCK_OUT"]),
  });
}
