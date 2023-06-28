"use client";
import { set } from "mongoose";
// import dbConnect from "@/lib/dbConnect";
import { GetRequest, postRequest } from "pages/api/hello";
import React, { useEffect } from "react";
import useSwrMutation from "swr/mutation";
const people = [
  { name: "John Doe", email: "john.doe@example.com" },
  { name: "Jane Smith", email: "jane.smith@example.com" },
  { name: "Bob Johnson", email: "bob.johnson@example.com" },
  // Add more people here...
];
type Props = {
  params: { id: string };
};

const PeopleList = ({ params: { id } }: Props) => {
  // const pple: any = await getPeopleByJobId(id);
  const {
    trigger: getPple,
    data,
    error,
    isMutating,
  } = useSwrMutation(`/api/jobs/getById`, postRequest);

  const [pple, setPple] = React.useState([]);
  const getRequest = async () => {
    const s = await getPple({ jobId: id });
    const d = await s?.json();
    setPple(d.data.appliedUsers);
  };
  useEffect(() => {
    getRequest();
  }, []);
  return (
    <ul className="space-y-4">
      {pple.map((person, index) => (
        <li
          key={index}
          className="flex items-center bg-gray-100 p-4 rounded shadow "
        >
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
            {person.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold">{person.name}</h3>
            <p className="text-gray-600">{person.email}</p>
            {/* <p className="text-gray-600">{person.appliedTo}</p> */}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PeopleList;
