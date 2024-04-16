/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IOrders, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (userData: IUser) => {
    if (await User.isUserExists(userData.userId)) {
        throw new Error("User Already Create");
    }

    const { password, ...result } = (await User.create(userData)).toObject();

    return result;
};

const getAllUser = async () => {
    const result = await User.find().select({
        username: 1,
        fullName: 1,
        age: 1,
        email: 1,
        address: 1,
    });
    return result;
};

const getSingleUser = async (userId: number) => {
    if (!(await User.isUserExists(userId))) {
        throw new Error("User Id Wrong");
    }

    const result = await User.findOne({ userId }).select({
        password: 0,
    });
    return result;
};

const updateUser = async (userId: number, userData: IUser) => {
    if (!(await User.isUserExists(userId))) {
        throw new Error("Update operation aborted");
    }

    const result = await User.findOneAndUpdate({ userId }, { $set: userData }, { new: true }).select({
        password: 0,
    });

    return result;
};

const deleteUser = async (userId: number) => {
    if (!(await User.isUserExists(userId))) {
        throw new Error("Delete operation aborted");
    }
    const result = await User.updateOne({ userId }, { isActive: false });
    return result;
};

const addOrderUser = async (userId: number, orderData: IOrders) => {
    if (!(await User.isUserExists(userId))) {
        throw new Error("Order insert operation aborted");
    }

    const result = await User.findOneAndUpdate({ userId }, { $push: { orders: orderData } }, { new: true });
    return result;
};

const getUserOrders = async (userId: number) => {
    if (!(await User.isUserExists(userId))) {
        throw new Error("User Id wrong");
    }

    const result = await User.findOne({ userId }).select({
        orders: 1,
    });
    return result;
};

const getUserTotalPrice = async (userId: number) => {
    if (!(await User.isUserExists(userId))) {
        throw new Error("User Id wrong");
    }

    const result = await User.aggregate([
        { $match: { userId } },
        { $unwind: "$orders" },
        {
            $group: {
                _id: "$userId",
                totalPrice: {
                    $sum: {
                        $multiply: ["$orders.price", "$orders.quantity"],
                    },
                },
            },
        },
        {
            $project: { totalPrice: 1 },
        },
    ]);
    return result;
};

export const userService = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
    addOrderUser,
    getUserOrders,
    getUserTotalPrice,
};
