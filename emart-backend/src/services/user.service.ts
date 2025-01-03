import { PrismaClient } from "@prisma/client";
import {
  UserCreatePayload,
  UserQueryResponse,
  UserResponse,
  UserUpdatePayload,
} from "../models/user.model";
import {
  storeUsersListMapper,
  storeUserMapper,
  userListMapper,
  userMapper,
} from "../mappers/user.mapper";
import { emailValidation, passwordValidation } from "../utils/validation.utils";
import HttpException from "../models/http-exception.model";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const createUser = async (
  input: UserCreatePayload,
  userId: number
): Promise<UserResponse> => {
  if (typeof input === "undefined") {
    throw new HttpException(400, "Data is not defined");
  }

  const { roleId, name, email, password, phone } = input;

  if (!roleId) throw new HttpException(422, "Role id can't be blank");
  const checkRole = await prisma.roles.findUnique({
    where: {
      id: roleId,
    },
  });
  if (!checkRole) throw new HttpException(400, "Invalid role id");
  if (checkRole.title === "super admin")
    throw new HttpException(401, "Cannot assign a new super admin");
  if (checkRole.title === "retailer")
    throw new HttpException(401, "Cannot create a retailer");

  if (!name) throw new HttpException(422, "Name can't be blank");

  if (!email) throw new HttpException(422, "Email can't be blank");
  else if (!emailValidation(email!))
    throw new HttpException(400, "Invalid Email");

  if (!password) throw new HttpException(422, "Password can't be blank");
  else if (!passwordValidation(password!))
    throw new HttpException(400, "Password invalid");

  if (!phone) throw new HttpException(422, "Phone number can't be blank");
  else if (!phone.match(/^(\+977)?[9][6-9]\d{8}$/)) {
    throw new HttpException(400, "Please enter valid mobile number");
  }

  const checkUser = await prisma.users.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
  if (!checkUser) throw new HttpException(404, "Invalid user id");

  const existingUser = await prisma.users.findMany({
    where: {
      OR: [{ email: email }, { phone: phone }],
    },
  });

  if (existingUser.length > 0) {
    const conflictField = existingUser[0].email === email ? "email" : "phone";
    throw new HttpException(409, `${conflictField} already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let userData: UserQueryResponse = await prisma.users.create({
    data: {
      roleId,
      name,
      email,
      password: hashedPassword,
      phone,
      managerId:
        checkUser.roles.title === "admin" ? checkUser.managerId : userId,
    },
    include: {
      roles: true,
    },
  });
  return userMapper(userData);
};

export const updateStoreUserStatus = async (
  userId: number,
  managerId: number
) => {
  const checkManager = await prisma.users.findUnique({
    where: { id: managerId },
    include: { roles: true, manager: { select: { roles: true } } },
  });
  const whereClause: any = { id: userId };
  if (
    checkManager?.roles.title === "admin" &&
    checkManager?.manager?.roles.title === "retailer"
  ) {
    whereClause.managerId = checkManager.managerId;
  }

  let currentUserData = await prisma.users.findUnique({
    where: whereClause,
    include: {
      roles: true,
    },
  });
  if (!currentUserData) throw new HttpException(404, "user not found");

  if (currentUserData.roles.title === "super admin")
    throw new HttpException(401, "Unauthorized action");

  const updatedUser: UserQueryResponse = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      status:
        currentUserData.status.toLowerCase() === "active"
          ? "Inactive"
          : "Active",
    },
    include: {
      roles: true,
      manager: {
        include: {
          stores: true,
          address: true,
        },
      },
    },
  });
  if (!updatedUser) throw new HttpException(400, "User deactivation failed");

  return storeUserMapper(updatedUser);
};

export const updateAdminUserStatus = async (
  userId: number,
  managerId: number
): Promise<UserResponse> => {
  const currentUserData = await prisma.users.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
  if (!currentUserData)
    throw new HttpException(404, "User to be updated not found");
  if (currentUserData.roles.title === "super admin")
    throw new HttpException(401, "Unauthorized action");

  const checkManager = await prisma.users.findUnique({
    where: { id: managerId },
    include: { roles: true, manager: { select: { roles: true } } },
  });
  if (
    checkManager?.roles.title === "admin" &&
    checkManager?.manager?.roles.title === "retailer"
  )
    throw new HttpException(401, " Not authorized");

  const updatedAdminUser: UserQueryResponse = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      status:
        currentUserData.status.toLowerCase() === "active"
          ? "Inactive"
          : "Active",
    },
    include: {
      roles: true,
    },
  });

  return userMapper(updatedAdminUser);
};

export const getAdminUsers = async (
  userId: number
): Promise<UserResponse[]> => {
  const checkUser = await prisma.users.findUnique({
    where: { id: userId },
    include: { roles: true ,manager: { include: { roles: true } }},
  });
  if (!checkUser) throw new HttpException(404, "Invalid user id");
  if (checkUser.roles.title === "admin") {
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  let usersList = await prisma.users.findMany({
    where: {
      managerId:
        checkUser.roles.title === "admin" ? checkUser.managerId : userId,
      roles: {
        title: {
          in: ["admin", "staff"],
        },
      },
    },
    include: {
      roles: true,
    },
  });
  if (!usersList) throw "Users not found";
  return userListMapper(usersList);
};

export const getStoreUsers = async (userId: number) => {
  const checkUser = await prisma.users.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
  if (!checkUser) throw new HttpException(404, "Invalid user id");

  const storeUsers = await prisma.users.findMany({
    where: {
      manager: {
        roles: {
          title: "retailer",
        },
      },
    },
    include: {
      roles: true,
      manager: {
        include: {
          stores: true,
          address: true,
        },
      },
    },
  });
  if (!storeUsers) throw "Users not found";
  return storeUsersListMapper(storeUsers);
};

export const updateUser = async (
  updatedUserData: UserUpdatePayload,
  userId: number,
  managerId: number
): Promise<UserResponse> => {
  if (typeof updatedUserData === "undefined") {
    throw "Data is not defined";
  }

  const { roleId, name, phone } = updatedUserData;

  const checkManager = await prisma.users.findUnique({
    where: { id: managerId },
    include: { roles: true },
  });
  let currentUserData = await prisma.users.findUnique({
    where: {
      id: userId,
      managerId:
        checkManager?.roles.title === "admin"
          ? checkManager.managerId
          : managerId,
    },
    include: {
      roles: true,
    },
  });
  if (!currentUserData) throw new HttpException(404, "user not found");

  if (!roleId) throw new HttpException(422, "Role id can't be blank");
  const checkRole = await prisma.roles.findUnique({
    where: {
      id: roleId,
    },
  });
  if (!checkRole) throw new HttpException(400, "Invalid role id");
  if (checkRole.title === "super admin")
    throw new HttpException(400, "Cannot assign a new super admin");
  if (checkRole.title === "retailer")
    throw new HttpException(401, "Cannot create a retailer");

  if (!name) throw new HttpException(422, "Name can't be blank");

  if (!phone) throw new HttpException(422, "Phone number can't be blank");
  else if (!phone.match(/^(\+977)?[9][6-9]\d{8}$/)) {
    throw new HttpException(400, "Please enter valid mobile number");
  }

  const existingPhoneUser = await prisma.users.findFirst({
    where: {
      phone: updatedUserData.phone,
      NOT: {
        id: currentUserData.id,
      },
    },
  });
  if (existingPhoneUser)
    throw new HttpException(400, "Phone number already exists.");

  const updatedData: UserQueryResponse = await prisma.users.update({
    where: {
      id: currentUserData.id,
    },
    data: {
      roleId:
        currentUserData.roles.title === "super admin"
          ? currentUserData.roleId
          : updatedUserData.roleId,
      name: updatedUserData.name,
      phone: updatedUserData.phone,
    },
    include: {
      roles: true,
    },
  });
  return userMapper(updatedData);
};
