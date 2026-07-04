import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import UserModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const parsePermissions = (permissions) => {
  if (!permissions) return {};

  if (typeof permissions === "string") {
    try {
      return JSON.parse(permissions);
    } catch {
      return {};
    }
  }

  if (typeof permissions === "object") {
    return permissions;
  }

  return {};
};

class AuthService {
  // =========================
  // Register
  // =========================
  static async register(userData) {
    const { first_name, last_name, email, password } = userData;

    // ตรวจสอบ Email ซ้ำ
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง User
    const userId = await UserModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    return {
      id: userId,
      first_name,
      last_name,
      email,
    };
  }

  // =========================
  // Login
  // =========================
  static async login({ email, password }) {
    // ค้นหาผู้ใช้
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // ตรวจสอบรหัสผ่าน
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Invalid email or password");
    }

    // สร้าง JWT
    const token = generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        permissions: parsePermissions(user.permissions),
      },
    };
  }

  static async googleLogin(credential) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await UserModel.findByEmail(payload.email);

    if (!user) {
      const id = await UserModel.create({
        first_name: payload.given_name,
        last_name: payload.family_name || "",
        email: payload.email,
        password: "",
        google_id: payload.sub,
        profile_image: payload.picture,
      });

      user = await UserModel.findById(id);
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        ...user,
        permissions: parsePermissions(user.permissions),
      },
    };
  }
}

export default AuthService;
