"use client";
import "../styles/globals.css";
import { UserType } from "../Models/User";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  selectContracts,
  selectUser,
  selectUserToken,
} from "../../store/slices/userSlice";
import { useAppSelector } from "../../store/store";
import moment from "moment";
import Link from "next/link";
import { Tabs } from "flowbite-react";
import ContractList from "./Components/ContractList";
interface props {
  users: UserType;
}
interface FormErrors {
  email?: string;
  password?: string;
}
function Home() {
  // await dbConnect();
  // const users = await getUsers();
  // const res = await fetch("http://localhost:3000/api/users");
  // console.log(await res.json());
  // console.log(res);

  const router = useRouter();
  const token = useAppSelector(selectUserToken);
  if (!token) redirect("/login");
  const user = useAppSelector(selectUser);
  const contracts = useAppSelector(selectContracts);
  useEffect(() => {
    token ? router.push("/") : router.push("/login");
    // if (!isSignIn) redirect("/login");
  }, [token]);
  return (
    <div className="w-full  flex justify-center">
      <div className="h-[32rem] w-[93vw]  max-w-6xl mx-2    py-10  ">
        <div className="">
          <div className="backdrop-blur max-h-[85vh] bg-gray-300/60 rounded-lg">
            <Tabs.Group
              className="self-center link:text-black"
              aria-label="Tabs with underline"
              style="underline"
            >
              <Tabs.Item title="Sending Contracts">
                <div className=" max-w-7xl max-h-[74vh] overflow-x-auto overflow-y-auto animate__animated animate__fadeInLeft">
                  {/* <h1 className="  text-center my-5 text-3xl">My Contracts</h1> */}
                  {contracts?.sending && contracts?.sending.length > 0 ? (
                    <ContractList contracts={contracts?.sending} />
                  ) : (
                    <div className="flex-col align-center justify-center text-center">
                      <h1 className="">No contracts yet...</h1>
                      <Link
                        href="/create-contract"
                        className="text-center inline-flex justify-center my-2  rounded-md border border-transparent  hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline flex-row bg-slate-600 items-center"
                      >
                        Create One Now!
                      </Link>
                    </div>
                  )}
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="Receiving Contracts"
                className="link:text-black"
              >
                <div className=" max-w-7xl max-h-[74vh] overflow-x-auto overflow-y-auto animate__animated animate__fadeInRight">
                  {/* <h1 className="  text-center my-5 text-3xl">My Contracts</h1> */}
                  {contracts?.receive && contracts?.receive.length > 0 ? (
                    <ContractList
                      contracts={contracts?.receive}
                      myId={user._id}
                    />
                  ) : (
                    <h1>No contracts yet...</h1>
                  )}
                </div>
              </Tabs.Item>
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

// function LoginForm() {

// }
