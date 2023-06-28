import { getUserByEmail } from "@/lib/services/users";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import moment from "moment";
import cookie from "cookie";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/services/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    try {
      if (!req.body.email)
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      const user = await getUserByEmail(req.body.email, true);
      if (!user)
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      console.log(user.password);
      const match = await compare(req.body.password, user.password as string);
      console.log(req.body.password != user.password);
      if (!match && req.body.password != user.password)
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });

      const { password, _id, email, name, jobs, appliedTo, description } = user;
      const accessToken = generateAccessToken({
        email: email as string,
        userId: _id as string,
      });
      const refreshToken = generateRefreshToken({
        email: email as string,
        userId: _id as string,
      });

      // delete result.value.password;

      // await updateUser(result.value)
      res.setHeader("set-cookie", [
        cookie.serialize("accessToken", accessToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV !== "development",
          // maxAge: 60 * 60,
          expires: moment(new Date()).utc(true).add(2, "days").toDate(),
          sameSite: "strict",
          path: "/",
        }),
        cookie.serialize("refreshToken", refreshToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV !== "development",
          // maxAge: 60 * 60,
          expires: moment(new Date()).utc(true).add(2, "months").toDate(),
          sameSite: "strict",
          path: "/",
        }),
      ]);

      res.statusCode = 200;
      return res.json({
        success: true,
        message: "Login success",
        data: {
          refreshToken,
          user: {
            token: accessToken,
            _id,
            email,
            name,
            jobs,
            isSignIn: true,
            appliedTo,
            description,
          },
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
