import z from "zod";

const LoginSchema=z.object({
    email:z.string().email().trim(),
    password:z.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(30, "Password is too long")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
    
})

export default LoginSchema