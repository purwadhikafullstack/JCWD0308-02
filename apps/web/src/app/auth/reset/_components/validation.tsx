import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ResetRequestSchema = z.object({
  email: z.string().email(),
})

export const useResetRequestForm = () => useForm<z.infer<typeof ResetRequestSchema>>({
  resolver: zodResolver(ResetRequestSchema),
  mode: 'all',
  defaultValues: {
    email: "",
  },
});