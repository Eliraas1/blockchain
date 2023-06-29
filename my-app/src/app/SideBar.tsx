"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  logout,
  selectUserToken,
  setContracts,
} from "../../store/slices/userSlice";
import { ContractState } from "../../store/slices/types";
import LoadingSpinner from "./Components/LoadingSpinner";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
const ContractElement = ({
  txt,
  pending,
  decline,
  _id,
}: {
  txt: string;
  pending: boolean;
  decline: boolean;
  _id?: string;
}) => {
  const url = _id ? `/contract/${_id}` : "#";
  const cursor = !_id && "cursor-default";
  return (
    <a
      href={url}
      className={`flex items-center p-2 text-base font-normal text-white rounded-lg  hover:text-gray-500 group-hover:text-gray-500 hover:bg-slate-200 ${cursor}`}
    >
      <svg
        className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-white group-hover:text-white  dark:group-hover:text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
      <span className="flex-1 ml-3 whitespace-nowrap font-normal text-lg">
        {txt}
      </span>
      {decline ? (
        <span className="bg-gray-700 ml-2 text-red-400 text-xs font-medium mr-2 px-2.5 py-0.5 rounded  border border-red-400">
          Decline
        </span>
      ) : pending ? (
        <span className="bg-gray-700 animate-pulse ml-2 text-amber-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded  border border-amber-500">
          Pending
        </span>
      ) : (
        <span className="bg-gray-700 ml-2 text-lime-400 text-xs font-medium mr-2 px-2.5 py-0.5 rounded  border border-lime-400">
          Accepted
        </span>
      )}
    </a>
  );
};
export const animateCSS = (
  element: string,
  animation: string,
  prefix = "animate__"
) =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
    if (!node) return;
    let list = node?.classList.value.split(" ");
    let index: number =
      list?.findIndex((element) => element == "animate__animated") || -1;
    if (~index) {
      node?.classList.remove(list[index + 1]);
      node?.classList.add(animationName);
      //@ts-ignore
      node?.style.setProperty("--animate-duration", "0.2s");
      // return;
    } else {
      node.classList.add(`${prefix}animated`, animationName);
    }

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event: Event) {
      event.stopPropagation();
      node?.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    // node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

export const toggleAnimate = (element: string, open: string, close: string) => {
  const sideBar = document.querySelector(element);
  const prefix = "animate__animated";
  if (sideBar) {
    let list = sideBar?.classList.value.split(" ");
    let index: number = list?.findIndex((element) => element == prefix) || -1;
    if (~index) {
      if (list[index + 1] == open) {
        sideBar?.classList.replace(list[index + 1], close);
      } else {
        sideBar?.classList.replace(list[index + 1], open);
      }
    } else {
      sideBar?.classList.add(prefix);
      sideBar?.classList.add(close);
    }
  }
};
export const fetcher = async (url: string) =>
  await fetch(url).then((r) => r.json());
export default function SideBar() {
  const [signIn, setIsSignIn] = useState(false);
  const token = useAppSelector(selectUserToken);
  // const address = useAddress();
  // const connectWallet = useMetamask();
  // const connect = async () => {
  //   await connectWallet();
  // };
  // useEffect(() => {
  //   console.log({ address });
  //   if (!address) {
  //     connect();
  //   }
  // }, [address]);
  // useEffect(() => {
  //   if (token) {
  //     setIsSignIn(true);
  //   } else setIsSignIn(false);
  // }, [token]);
  if (!token) return <></>;
  return <RealSideBar />;
}
export function RealSideBar() {
  const { data, error, isLoading } = useSWR("/api/contract/getMy", fetcher, {
    // refreshInterval: 10000,
  });
  const dispatch = useAppDispatch();
  const [mySendingContracts, setMySendingContracts] = useState([]);
  const [myReceiveContracts, setMyReceiveContractsContracts] = useState([]);
  const CloseIcon = () => (
    <a
      // onClick={closeSideBar}
      onClick={() => {
        toggleAnimate("aside", "animate__fadeInLeft", "animate__fadeOutLeft");
      }}
      className="flex items-center self-center mt-1 w-fit text-base font-normal text-white rounded-lg  hover:text-gray-500 group-hover:text-gray-500 hover:bg-slate-200 cursor-pointer
       opacity-[0.95]  py-4 px-4 bg-slate-700 "
    >
      <svg
        id="Layer_1"
        fill="currentColor"
        version="1.1"
        viewBox="0 0 500 500"
        className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
        // xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        // xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
        />
      </svg>
      <span className="flex-1  whitespace-nowrap font-normal text-lg"></span>
    </a>
  );

  useEffect(() => {
    animateCSS("aside", "fadeInLeft");
  }, []);

  useEffect(() => {
    if (data) {
      if (data.status == 401) {
        dispatch(logout());
      }
      dispatch(
        setContracts({
          receive: data.data?.myReceiveContracts,
          sending: data.data?.mySendingContracts,
        })
      );
      setMySendingContracts(data.data?.mySendingContracts);
      setMyReceiveContractsContracts(data.data?.myReceiveContracts);
    }
  }, [data, error, dispatch]);

  return (
    <aside
      className="flex-grow absolute z-40 rounded border-transparent border-2"
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto max-h-[80vh] opacity-[0.95]  py-4 px-3 bg-slate-700 rounded dark:bg-gray-800">
        <ul className="space-y-2">
          <li>
            <div className="">
              <span className="p-2 text-transparent bg-clip-text bg-gradient-to-r to-orange-400 from-sky-400 hover:to-sky-200 hover:from-orange-400">
                My Sending Contracts
              </span>
              {isLoading && (
                <div className="pt-6 pl-10">
                  <LoadingSpinner />
                </div>
              )}
              {mySendingContracts?.map((cont: ContractState) => (
                <ContractElement
                  key={cont._id}
                  txt={"Contract " + cont.carBrand}
                  pending={!cont.confirm}
                  decline={cont.decline as boolean}
                  _id={cont._id as string}
                />
              ))}
              {!mySendingContracts && (
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-400 font-normal text-lg">
                  No Contracts
                </span>
              )}
            </div>
            <div>
              <span className="p-2  text-transparent bg-clip-text bg-gradient-to-r to-sky-400 from-orange-400 hover:to-sky-200 hover:from-orange-400">
                My Receiving Contracts
              </span>
              {isLoading && (
                <div className="pt-6 pl-10">
                  <LoadingSpinner />
                </div>
              )}
              {myReceiveContracts?.map((cont: ContractState) => (
                <ContractElement
                  key={cont._id}
                  txt={"Contract " + cont.carBrand}
                  pending={!cont.confirm}
                  decline={cont.decline as boolean}
                  // _id={cont._id as string}
                />
              ))}
              {!myReceiveContracts && (
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-400 font-normal text-lg">
                  No Contracts
                </span>
              )}
            </div>
          </li>
        </ul>
      </div>
      <CloseIcon />
    </aside>
  );

  /*
    <div className="z-1 absolute animate__animated animate__fadeInLeft">
      <Sidebar
        color="transparent"

        // className=" opacity-95 bg-slate-400"
        // aria-label="Default sidebar example"
      >
        <Sidebar.Items className="bg-transparent">
          <Sidebar.ItemGroup className="bg-transparent">
            <Sidebar.Item href="#" icon={ContractIcon}>
              Kanban
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ContractIcon} label="3">
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ContractIcon}>
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ContractIcon}>
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ContractIcon}>
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={ContractIcon}>
              Sign Up
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={CloseIcon}>
              
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
*/
}
