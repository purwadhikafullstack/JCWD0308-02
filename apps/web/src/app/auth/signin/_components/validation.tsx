import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const SigninFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(512),
})

export const useSigninForm = () => useForm<z.infer<typeof SigninFormSchema>>({
  resolver: zodResolver(SigninFormSchema),
  mode: 'all',
  defaultValues: {
    email: "",
    password: "",
  },
});