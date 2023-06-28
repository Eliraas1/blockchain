import { Toast } from "flowbite-react";
import moment from "moment";
import { set } from "mongoose";
import Link from "next/link";
import { postRequest } from "../../pages/api/hello";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { selectMessage } from "../../../store/slices/showSlice";
import { setReceivingContract } from "../../../store/slices/userSlice";
import { ContractState } from "../../../store/slices/types";
import useSWRMutation from "swr/mutation";
type props = {
  contracts: ContractState[];
  myId?: string;
};
function ContractList({ contracts, myId }: props) {
  const dispatch = useDispatch();
  const appMessage = useAppSelector(selectMessage);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (appMessage) setMessage(appMessage);
  }, [appMessage]);

  const {
    trigger: AcceptContract,
    data: acceptContractData,
    error: acceptContractError,
    isMutating: isMutatingAccpet,
  } = useSWRMutation("/api/contract/accept", postRequest);
  const {
    trigger: DeclineContract,
    data: declineContractData,
    error: declineContractError,
    isMutating: isMutatingDecline,
  } = useSWRMutation("/api/contract/decline", postRequest);

  const handleDecline = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contId: string
  ) => {
    event.preventDefault();
    try {
      const res = await DeclineContract({
        id: contId,
      });
      const jsonRes = await res?.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        console.log(jsonRes.data);
        dispatch(
          setReceivingContract({ _id: contId, confirm: false, decline: true })
        );
        setMessage("Contract Declined!");
      } else {
        console.log(jsonRes.message);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleAccept = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contId: string
  ) => {
    event.preventDefault();
    try {
      const res = await AcceptContract({
        id: contId,
      });
      const jsonRes = await res?.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        console.log(jsonRes.data);
        dispatch(
          setReceivingContract({ _id: contId, confirm: true, decline: false })
        );
        setMessage("Contract Accepted!");
        // setContracts(jsonRes.data.contracts);
      } else {
        console.log(jsonRes.message);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <>
      {message && (
        <Toast className="my-toast mx-auto bg-green-200 mb-2 min-w-fit">
          <div className="flex items-center justify-center rounded-2xl bg-green-100 text-green-500 ">
            <svg
              className=" w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-3 text-sm font-normal text-green-500">
            {message}
          </div>
          <Toast.Toggle className="hover:bg-green-100 ml-2 bg-green-200" />
        </Toast>
      )}
      <table className=" max-w-7xl w-full  text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase tracking-widest backdrop-blur bg-gray-300/60 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              From
            </th>
            <th scope="col" className="px-6 py-3">
              To
            </th>
            <th scope="col" className="px-6 py-3">
              Brand
            </th>
            <th scope="col" className="px-6 py-3">
              Expire
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {contracts?.map((cont) => {
            const statusColor = cont.confirm
              ? "bg-green-400"
              : cont.decline
              ? "bg-red-400"
              : !cont.confirm
              ? "bg-amber-400 animate-ping"
              : "bg-gray-600";
            const status = cont.confirm
              ? "Accepted"
              : cont.decline
              ? "Declined"
              : !cont.confirm
              ? "Pending"
              : "Expired";
            const accept = myId == cont.to?._id && status == "Pending";
            return (
              <tr
                key={cont._id}
                className="bg-white-300/50 backdrop-blur border-b hover:bg-gray-50/50 hover:backdrop-blur"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      {cont.from?.name}
                    </div>
                    <div className="font-normal text-gray-500">
                      {cont.from?.email}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="pl-3">
                    <div className="text-base text-gray-900 font-semibold">
                      {cont.to?.name}
                    </div>
                    <div className="font-normal text-gray-500">
                      {cont.to?.email}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">{cont.carBrand}</td>
                <td className="px-6 py-4">
                  {moment(cont.expires).format("DD-MM-YYYY")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`${statusColor} h-2.5 w-2.5 rounded-full mr-2 `}
                    ></div>
                    <div
                      className={`${
                        status == "Pending" && "animate-pulse"
                      } uppercase tracking-wide`}
                    >
                      {status}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {accept ? (
                    <div className=" flex place-content-center w-32 grid-cols-2 divide-x-[2px]">
                      <div
                        onClick={(e) => {
                          handleAccept(e, cont._id as string);
                        }}
                        className="cursor-pointer font-medium pr-2 text-green-500 hover:underline"
                      >
                        Accept
                      </div>

                      <div
                        onClick={(e) => {
                          handleDecline(e, cont._id as string);
                        }}
                        className="cursor-pointer font-medium pl-2 text-red-500 hover:underline"
                      >
                        Decline
                      </div>
                    </div>
                  ) : status == "Accepted" || status == "Declined" ? (
                    <div></div>
                  ) : (
                    // <a
                    //   href="#"
                    //   className="font-medium text-red-500 hover:underline"
                    // >
                    //   Delete
                    // </a>
                    <Link
                      href={`contract/${cont._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ContractList;
