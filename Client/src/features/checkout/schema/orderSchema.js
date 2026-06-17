import {z} from "zod"
import { egyptCities } from "./cites";

const cityValues = egyptCities.map(c => c.value)

const orderSchema=z.object({
    shippingAddress:z.object({
       city: z.enum(cityValues, {
      errorMap: () => ({ message: "Please select a valid Egyptian governorate" })
    }),
        street:z.string().min(8,"Please enter your full address"),
        phone: z.string()
        .trim()
        .regex(
            /^(?:\+20)?\d{11}$/, 
            "Phone number must be 11 digits"
        ),
        postalCode: z.coerce.number().int().positive("Please enter a valid postal code")
    }),
    paymentMethod: z.enum(["Cash", "Card"], {
  errorMap: () => ({ message: "Please choose a valid payment method" })
})
})

export default orderSchema