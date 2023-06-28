import { UserType } from "Models/User";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import moment from "moment";
import { UserState } from "store/slices/userSlice";
export interface Request extends NextRequest {
  user: UserState; // Replace "any" with the type of your user object
}
export interface ApiRequest extends NextApiRequest {
  user: UserType; // Replace "any" with the type of your user object
}
declare global {
  var myId: any; // This must be a `var` and not a `let / const`
}
export async function middleware(req: Request) {
  const res = NextResponse.next();
  const accessToken: string = req.cookies.get("accessToken")?.value || "";
  const refreshToken: string = req.cookies.get("refreshToken")?.value || "";
  if (!accessToken) {
    console.log("no access token");
    return NextResponse.rewrite(new URL("/api/error", req.url));
  }
  const accessSecret = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET
  );
  const refreshSecret = new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET
  );

  try {
    const { payload } = await jwtVerify(accessToken, accessSecret);

    const requestHeaders = new Headers(req.headers);
    console.log(
      "------------------------------------------------------------------------------------------------",
      payload?.userId
    );
    requestHeaders.set("X-HEADER", payload?.userId as string);

    // You can also set request headers in NextResponse.rewrite
    const response = NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    });
    return response;
  } catch (err: any) {
    try {
      const alg = "HS256";
      console.log("access token not verify trying verify refresh");
      const { payload: decoded } = await jwtVerify(refreshToken, refreshSecret);
      const newAccessToken = await new SignJWT({
        email: decoded?.email,
        userId: decoded?.userId,
      })
        .setProtectedHeader({ alg })
        .setExpirationTime("1h")
        .sign(accessSecret);
      const newRefreshToken = await new SignJWT({
        email: decoded?.email,
        userId: decoded?.userId,
      })
        .setProtectedHeader({ alg })
        .setExpirationTime("2h")
        .sign(refreshSecret);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("X-HEADER", decoded?.userId as string);

      // You can also set request headers in NextResponse.rewrite
      const response = NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      });

      req.cookies.delete("accessToken");
      req.cookies.delete("refreshToken");

      response.cookies
        .set({
          name: "accessToken",
          value: newAccessToken,
          httpOnly: true,
          expires: moment(new Date()).utc(true).add(1, "hours").toDate(),
          path: "/",
          sameSite: "strict",
        })
        .set({
          name: "refreshToken",
          value: newRefreshToken,
          httpOnly: true,
          expires: moment(new Date()).utc(true).add(6, "months").toDate(),
          path: "/",
          sameSite: "strict",
        });
      return response;
    } catch (err: any) {
      req.cookies.delete("accessToken");
      req.cookies.delete("refreshToken");
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      console.log("not verify refresh token - delete cookies", err);
      return NextResponse.rewrite(new URL("/api/error", req.url));
    }
  }
}

export const config = {
  //TODO: CHANGE TO JOBS
  matcher: ["/api/users/:path*", "/api/jobs/:path*", "/dashboard/:path*"],
};
