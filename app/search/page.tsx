"use client";
import JobList from "app/Components/JobList";
import { jobCategories } from "../../constants";
import { getRequest, postRequest } from "pages/api/hello";
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import { JobsType } from "store/slices/userSlice";

const Search = () => {
  //TODO: change to refs
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Full-time");
  const [jobs, setJobs] = useState<JobsType[]>([]);
  //TODO: set all jobs in redux and display them here at first
  const {
    trigger: search,
    data,
    error,
    isMutating,
  } = useSWRMutation("/api/jobs/getByField", getRequest);

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const handleLocationChange = (event: any) => {
    setLocation(event.target.value);
  };

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
  };
  const handlePositionChange = (event: any) => {
    setType(event.target.value);
    console.log({ type, dada: event.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const body = {
      category,
      location,
      title,
      description,
      type,
    };
    //TODO: use swr and set jobs that return from api
    const _data = await search(body as any);
    const results = await _data?.json();
    const _jobs = results.data;

    setJobs(_jobs);
    // console.log({ _jobs });
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Search Jobs</h1>
      <form className="flex justify-center items-center">
        {/* Category Dropdown */}
        <select
          name="category"
          value={category}
          onChange={handleCategoryChange}
          className="mr-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          required
        >
          <option value="">Category</option>
          {jobCategories.map((category: string) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {/* Location Input */}
        <input
          type="text"
          placeholder="Location"
          className="mr-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          value={location}
          onChange={handleLocationChange}
        />
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          className="mr-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          value={title}
          onChange={handleTitleChange}
        />
        {/* Description Input */}
        <input
          type="text"
          placeholder="Description"
          className="mr-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          value={description}
          onChange={handleDescriptionChange}
        />
        {/* Position Type Dropdown */}
        <select
          name="type"
          value={type}
          onChange={handlePositionChange}
          className="mr-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          required
        >
          <option value="Full-time">Full-time</option>
          <option value="Part time">Part-time</option>
          <option value="Student">Student position</option>
        </select>
        {/* Search Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Search
        </button>
      </form>
      {/* Render JobList component with search parameters */}
      <div className=" container mt-4 p-10 justify-center items-center bg-opacity-60 bg-slate-600 rounded-2xl ">
        <JobList jobs={jobs} />
      </div>
    </div>
  );
};

export default Search;
