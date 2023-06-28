"use client";
import { postRequest } from "pages/api/hello";
import { jobCategories } from "../../constants";
import React, { useState } from "react";
import { JobsType } from "store/slices/userSlice";
import useSWRMutation from "swr/mutation";
import { redirect } from "next/navigation";
import router from "next/router";

const initialValues: JobsType = {
  title: "",
  description: "",
  location: "",
  category: "",
  subCategory: "",
  type: "Full time",
};
const CreateJobForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobData, setJobData] = useState<JobsType>(initialValues);
  const {
    trigger: addJob,
    data,
    error,
    isMutating,
  } = useSWRMutation("/api/jobs/create", postRequest);
  const resetFields = () => setJobData(initialValues);
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    await addJob(jobData);
    resetFields();
    setIsLoading(false);
  };

  return (
    <div className="max-w-sm  mx-auto bg-white p-6 rounded-md mt-2">
      <h1 className="text-2xl font-semibold mb-4">Add New Job</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          Title
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </label>
        <label className="block mb-4">
          Description
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            // required
          />
        </label>
        <label className="block mb-4">
          Location
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </label>
        <label className="block mb-4">
          Category
          <select
            name="category"
            value={jobData.category}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          >
            {jobCategories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-4">
          Sub category
          <input
            type="text"
            name="subCategory"
            value={jobData.subCategory}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </label>
        <label className="block mb-4">
          Type
          <select
            name="type"
            value={jobData.type}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part time">Part-time</option>
            <option value="Student">Student position</option>
          </select>
        </label>
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {isLoading ? "Adding Job..." : "Add Job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJobForm;
