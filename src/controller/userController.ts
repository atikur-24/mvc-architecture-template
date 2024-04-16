/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { IOrders, IUser } from "./user.interface";
import { userService } from "./user.service";
import userValidSchema, { ordersSchema } from "./user.validation";

const createUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const zodParseData = userValidSchema.parse(userData);

        const result = await userService.createUser(zodParseData);

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "something went wrong",
            err: error,
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUser();

        res.status(200).json({
            success: true,
            message: "User fetched successfully!",
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            messages: "user not found!",
            error: {
                code: 404,
                description: "user not found",
            },
        });
    }
};
const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const result = await userService.getSingleUser(parseFloat(userId));

        res.status(200).json({
            success: true,
            message: "User fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "user not found!",
            error: {
                code: 404,
                description: "user not found",
            },
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userData: IUser = req.body;
        const zodParseData = userValidSchema.parse(userData);

        const result = await userService.updateUser(parseFloat(userId), zodParseData);
        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: {
                code: 404,
                description: "User not found!",
            },
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        await userService.deleteUser(parseFloat(userId));

        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: null,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            messages: error.message || "Something went wrong",
            error: {
                code: 404,
                description: "user not found",
            },
        });
    }
};

const addOrderUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const orderData: IOrders = req.body;
        const zodParseData = ordersSchema.parse(orderData);
        await userService.addOrderUser(parseFloat(userId), zodParseData);
        res.status(200).json({
            status: "success",
            message: "Order created successfully!",
            data: null,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: {
                code: 404,
                description: "User not found!",
            },
        });
    }
};

const getUserOrders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const result = await userService.getUserOrders(parseFloat(userId));

        res.status(200).json({
            success: true,
            message: "Order fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "user not found!",
            error: {
                code: 404,
                description: "user not found",
            },
        });
    }
};
const getUserTotalPrice = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const result = await userService.getUserTotalPrice(parseFloat(userId));

        res.status(200).json({
            success: true,
            message: "Total price calculated successfully!",
            data: result.length > 0 ? result : { totalPrice: 0 },
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message || "user not found!",
            error: {
                code: 404,
                description: "user not found",
            },
        });
    }
};

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    addOrderUser,
    getUserOrders,
    getUserTotalPrice,
};
