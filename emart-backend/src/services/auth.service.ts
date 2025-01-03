import {
  UserCreatePayload,
  UserLoginPayload,
  UserLoginResponse,
  UserQueryResponse,
  UserResponse,
} from "../models/user.model";
import { emailValidation, passwordValidation } from "../utils/validation.utils";
import { PrismaClient, Prisma, Roles } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { userLoginMapper, userMapper } from "../mappers/user.mapper";
import HttpException from "../models/http-exception.model";
import JWT, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.utils";
import { Role } from "../models/role.model";
import sendEmail from "./mail.service";

export const signup = async (
  input: UserCreatePayload,
): Promise<UserResponse> => {
  if (typeof input === "undefined") {
    throw new HttpException(400, "Data is not defined");
  }

  const {
    roleId,
    name,
    email,
    password,
    phone,
    country,
    city,
    streetName,
    zipcode,
  } = input;


  if (!roleId) throw new HttpException(422, "Role id can't be blank")
  const checkRole = await prisma.roles.findUnique({
    where: {
      id: roleId
    }
  })
  if (!checkRole) throw new HttpException(400, "Invalid role id")

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

  if (!country) throw new HttpException(422, "Country can't be blank");
  if (!city) throw new HttpException(422, "City can't be blank");
  if (!streetName) throw new HttpException(422, "Street name can't be blank");

  const existingUser = await prisma.users.findMany({
    where: {
      OR: [
        { email: email },
        { phone: phone },
      ],
    },
  });

  if (existingUser.length > 0) {
    const conflictField = existingUser[0].email === email ? 'email' : 'phone';
    throw new HttpException(409, `${conflictField} already exists`);
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const userCreated = await tx.users.create({
      data: {
        roleId,
        name,
        email,
        password: hashedPassword,
        phone,
      }
    });
    await tx.address.create({
      data: {
        userId: userCreated.id,
        country: country,
        city: city,
        streetName,
        zipcode: Number(zipcode),
      },
    });
  });

  const userData = await prisma.users.findUnique({
    where: {
      email: email
    }, include: {
      address: true,
      roles: true
    }
  })
  if (!userData) throw new HttpException(404, "User not created")

  return userMapper(userData);
};

export const adminlogin = async (
  userPayload: UserLoginPayload
) => {
  if (typeof userPayload === "undefined") {
    throw new HttpException(400, "Data is not defined");
  }

  const { email, password } = userPayload;

  if (!email) throw new HttpException(422, "Email can't be blank");
  else if (!emailValidation(email!))
    throw new HttpException(400, "Invalid Email");

  if (!password) throw new HttpException(422, "Password can't be blank");
  else if (!passwordValidation(password!))
    throw new HttpException(400, "Password invalid");

  const validUser = await prisma.users.findUnique({
    where: {
      email: email,
    },
    include: {
      address: true,
      roles: true,
      manager: { include: {roles: true}}
    },
  });
  if (!validUser)
    throw new HttpException(404, "User not found");
  if (validUser.roles.title === "admin" || validUser.roles.title === 'staff') {
    if (validUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }
  if(validUser.roles.title === "retailer") throw new HttpException(401, "Unauthorized access");

  if (bcrypt.compareSync(password, validUser.password)) {
    const accessToken = generateAccessToken(validUser.id)
    const refreshToken = generateRefreshToken(validUser.id)

    await prisma.refreshToken.upsert({
      where: { userId: validUser.id },
      update: { token: refreshToken },
      create: {
        token: refreshToken,
        userId: validUser.id,
      },
    });

    return userLoginMapper({ ...validUser, accessToken, refreshToken });
  } else {
    throw new HttpException(401, "Credentials doesn't match");
  }
};
export const storeLogin = async (
  userPayload: UserLoginPayload
) => {
  if (typeof userPayload === "undefined") {
    throw new HttpException(400, "Data is not defined");
  }

  const { email, password } = userPayload;

  if (!email) throw new HttpException(422, "Email can't be blank");
  else if (!emailValidation(email!))
    throw new HttpException(400, "Invalid Email");

  if (!password) throw new HttpException(422, "Password can't be blank");
  else if (!passwordValidation(password!))
    throw new HttpException(400, "Password invalid");

  const validUser = await prisma.users.findUnique({
    where: {
      email: email,
    },
    include: {
      address: true,
      roles: true,
      manager: { include: {roles: true}}
    },
  });
  if (!validUser)
    throw new HttpException(404, "User not found");
  if (validUser.roles.title === "admin" || validUser.roles.title === 'staff') {
    if (validUser?.manager?.roles.title !== "retailer")
      throw new HttpException(401, "Unauthorized access");
  }
  if(validUser.roles.title === "super admin") throw new HttpException(401, "Unauthorized access");

  if (bcrypt.compareSync(password, validUser.password)) {
    const accessToken = generateAccessToken(validUser.id)
    const refreshToken = generateRefreshToken(validUser.id)

    await prisma.refreshToken.upsert({
      where: { userId: validUser.id },
      update: { token: refreshToken },
      create: {
        token: refreshToken,
        userId: validUser.id,
      },
    });

    return userLoginMapper({ ...validUser, accessToken, refreshToken });
  } else {
    throw new HttpException(401, "Credentials doesn't match");
  }
};

export const profile = async (id: number): Promise<UserResponse> => {
  const profileData = await prisma.users.findUnique({
    where: {
      id,
    },
    include: {
      roles: true,
      address: true,
    },
  });

  if (!profileData) {
    throw new HttpException(404, "User not found");
  }
  return userMapper(profileData);
};

export const refetch = async (token: string): Promise<string> => {
  let tokenParts = token.split(" ")
  const refreshToken = tokenParts.pop()
  if (!refreshToken) {
    throw new HttpException(403, 'Unauthorized access')
  }

  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!storedToken) throw new HttpException(403, "Token not found");

  const tokenVerify: JwtPayload | string = JWT.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!)

  if (typeof tokenVerify === 'string') {
    throw new HttpException(400, "Unexpected token")
  }

  return generateAccessToken(tokenVerify.id)
}

export const logout = async (refreshToken: string, accessToken: string) => {
  try {
    await prisma.blacklistedToken.create({ data: { token: accessToken } });
    await prisma.refreshToken.delete({
      where: { token: refreshToken }
    });
    return "Logout Successful";
  } catch (error) {
    throw new HttpException(500, 'Logout Failed');
  }
};

export const fetchRoles = async (): Promise<Pick<Role, 'id' | 'title'>[]> => {
  const roles = await prisma.roles.findMany({
    where: {
      title: {
        notIn: ["super admin", "retailer"]
      }
    },
    select: {
      id: true,
      title: true,
    }
  });

  return roles
}

export const initiatePasswordReset = async (userEmail: string) => {
  const user = await prisma.users.findUnique({
    where: { email: userEmail },
  });

  if (!user) throw new HttpException(404, 'User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000);

  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      expiry: resetTokenExpiry,
      userId: user.id,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  sendEmail({
    to: userEmail,
    subject: 'Password Reset Request',
    text: `Click the link to reset your password: ${resetLink}`,
  });
}

export const changePassword = async (token: string, newPassword: string) => {

  if (!newPassword) throw new HttpException(422, "Password can't be blank");
  else if (!passwordValidation(newPassword!))
    throw new HttpException(400, "Password invalid");

  if (!token) throw new HttpException(400, 'Invalid Request')

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  if (!resetToken || resetToken.expiry < new Date()) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });
}

export const sendOTP = async (userEmail: string) => {

  if (!userEmail) throw new HttpException(422, "Email can't be blank");
  else if (!emailValidation(userEmail!))
    throw new HttpException(400, "Invalid Email");

  const checkUser = await prisma.users.findUnique({
    where: { email: userEmail }
  });
  if (!checkUser) throw new HttpException(404, "Email not registered");

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  sendEmail({
    to: userEmail,
    subject: 'Verify your Email',
    text: `Hello ${checkUser.name}`,
    html: `<p>Please enter the following 6-digit code into the Email Verification page.</p><p>The OTP <b>expires after 1:30 mins</b></p><p style="text-align:center; color:#ff5e36; font-size:30px"><b>${otp}</b></p>`
  });

  const hashedOTP = bcrypt.hashSync(otp, 10);
  const createOrUpdateOTP = await prisma.oTP.upsert({
    where: {
      userId: checkUser.id
    },
    update: {
      otp: hashedOTP,
      expires_at: new Date(Date.now() + 90000),
      failed_attempts: 0,
      last_attempt: new Date()
    },
    create: {
      userId: checkUser.id,
      otp: hashedOTP,
      expires_at: new Date(Date.now() + 90000),
      failed_attempts: 0,
      last_attempt: new Date()
    }
  });

  if (!createOrUpdateOTP) throw new HttpException(400, "OTP creation failed");
  return { id: checkUser.id, email: checkUser.email };
};

export const verifyOTP = async (id: number, otp: string) => {
  const checkOTP = await prisma.oTP.findUnique({
    where: { userId: id }
  });

  if (!checkOTP) throw new HttpException(404, "Invalid or already verified OTP");

  if (checkOTP.expires_at < new Date()) {
    throw new HttpException(401, "OTP has expired");
  }

  if (checkOTP.failed_attempts >= 6) {
    await prisma.oTP.delete({ where: { userId: id } });
    throw new HttpException(429, "Too many failed attempts. Resend otp");
  }

  if (!bcrypt.compareSync(otp, checkOTP.otp)) {
    await prisma.oTP.update({
      where: { userId: id },
      data: {
        failed_attempts: { increment: 1 },
        last_attempt: new Date()
      }
    });

    throw new HttpException(401, "Invalid OTP");
  }

  // Mark OTP as verified
  await prisma.oTP.update({
    where: { userId: id },
    data: {
      verified: true,
      failed_attempts: 0,
      last_attempt: new Date()
    }
  });

  return id;
}

export const changePasswordThroughOTP = async (userId: number, newPassword: string) => {
  const checkOTP = await prisma.oTP.findUnique({
    where: { userId: userId }
  });
  if (!checkOTP || !checkOTP.verified) throw new HttpException(400, 'OTP has not been verified');

  if (!newPassword) throw new HttpException(422, "Password can't be blank");
  if (!passwordValidation(newPassword)) throw new HttpException(400, "Invalid password");

  if (!userId) throw new HttpException(400, 'Invalid ID');

  const checkUser = await prisma.users.findUnique({
    where: { id: userId }
  });
  if (!checkUser) throw new HttpException(404, 'User not found');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.users.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  sendEmail({
    to: checkUser.email,
    subject: 'Password Changed',
    html: `<p>Dear ${checkUser.name},</p> <p>Your password has been changed successfully !!</p>`
  });

  await prisma.oTP.delete({ where: { userId: userId } });
};

export const resendOTP = async (userId: number) => {

  if (!userId) throw new HttpException(422, "User id can't be blank");

  const checkUser = await prisma.users.findUnique({
    where: { id: userId }
  });
  if (!checkUser) throw new HttpException(404, "Email not registered");

  const resendOTP = await sendOTP(checkUser.email)
  return resendOTP
};