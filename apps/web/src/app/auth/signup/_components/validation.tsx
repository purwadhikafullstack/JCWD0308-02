import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const SignupFormSchema = z.object({
  email: z.string().email(),
})

export const useSignupForm = () => useForm<z.infer<typeof SignupFormSchema>>({
  resolver: zodResolver(SignupFormSchema),
  mode: 'all',
  defaultValues: {
    email: "",
  },
});