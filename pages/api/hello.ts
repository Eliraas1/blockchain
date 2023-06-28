// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { selectUser } from "store/slices/userSlice";

type Data = {
  name: string;
};
export async function postRequest(url: string, { arg }: { arg: any }) {
  return fetch(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    ...(arg && { body: JSON.stringify(arg) }),
  });
}
export async function getRequest(url: string, arg: any) {
  console.log({ arg });
  const queryParams = arg ? new URLSearchParams(arg.arg).toString() : "";
  const requestUrl = `${url}?${queryParams}`;
  return fetch(requestUrl, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });
}
export async function GetRequest(url: string, { arg }: { arg: any }) {
  return fetch(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
    ...(arg && { body: JSON.stringify(arg) }),
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
