import bcrypt from "bcrypt";
import { Query, Schema, model } from "mongoose";
import config from "../../config";
import { IAddress, IFullName, IOrders, IUser, UserModel } from "./user.interface";

const userNameSchema = new Schema<IFullName>({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        maxlength: [20, "Name can not be more than 20 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
        maxlength: [20, "Name can not be more than 20 characters"],
    },
});
const userAddressSchema = new Schema<IAddress>({
    street: {
        type: String,
        required: [true, "Street is required"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
});
const userOrdersSchema = new Schema<IOrders>({
    productName: {
        type: String,
        required: [true, "Product name is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
});
// user management Schema
const userSchema = new Schema<IUser, UserModel>({
    userId: {
        type: Number,
        unique: true,
        required: [true, "User ID is required"],
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Username is required"],
    },
    password: {
        type: String,
        maxlength: [20, "Password cannot be more than 20 characters"],
        minlength: [6, "Password must be at least 6 characters"],
        required: [true, "Password is required"],
    },
    fullName: {
        type: userNameSchema,
        required: [true, "Full Name is required"],
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    isActive: {
        type: Boolean,
        required: [true, "isActive field is required"],
        default: true,
    },
    hobbies: {
        type: [String],
        required: [true, "Hobbies are required"],
    },
    address: {
        type: userAddressSchema,
        required: [true, "Address is required"],
    },
    orders: [userOrdersSchema],
});

// encrypted password
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
    next();
});

// work fine all method and give only isActive: "true"
userSchema.pre(/^find/, function (this: Query<IUser, Document>, next) {
    this.find({ isActive: { $ne: false } });
    next();
});

// checking  user already DB exists
userSchema.statics.isUserExists = async function (userId: number) {
    const existsUser = await User.findOne({ userId });
    return existsUser;
};

export const User = model<IUser, UserModel>("User", userSchema);
