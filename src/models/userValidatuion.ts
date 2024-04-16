import { z } from "zod";

const fullNameSchema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }).max(20, { message: "Name cannot be more than 20 characters" }),
    lastName: z.string().min(1, { message: "Last Name is required" }).max(20, { message: "Name cannot be more than 20 characters" }),
});

const addressSchema = z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
});

export const ordersSchema = z.object({
    productName: z.string().min(1, { message: "Product name is required" }),
    price: z.number().min(0, { message: "Price must be greater than or equal to 0" }),
    quantity: z.number().min(1, { message: "Quantity must be greater than or equal to 1" }),
});

const userValidSchema = z.object({
    userId: z.number().positive({ message: "User ID must be a positive number" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password cannot be more than 20 characters" }),
    fullName: fullNameSchema,
    age: z.number().positive({ message: "Age must be a positive number" }),
    email: z.string().min(1, { message: "Email is required" }).email(),
    isActive: z.boolean().default(true),
    hobbies: z.array(z.string().min(1, { message: "Hobbies are required" })),
    address: addressSchema,
    orders: z.array(ordersSchema).optional(),
});

export default userValidSchema;
