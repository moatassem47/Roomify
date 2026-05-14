import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().trim().min(3, "First name must be at least 3 characters"),
  lastName: z.string().trim().min(3, "Last name must be at least 3 characters"),
  email: z.string().trim().email("Invalid email address"),

  password: z.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password is too long")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),

  confirmPassword: z.string().trim(),

  phone: z.string()
    .trim().length(11, "Phone number must be 11 digits"),
  
    terms: z.literal(true, {
    message: "You must agree to the Terms of Service and Privacy Policy" 
    }),
  address: z.object({
    city: z.string().min(1, "City is required"),
    streetAddress: z.string().trim().min(4, "Please enter your full address")
  })
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default registerSchema;