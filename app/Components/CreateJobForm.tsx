import React, { useState } from "react";

const CreateJobForm = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    subCategory: "",
    type: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Here you can send the jobData object to an API to add a new job
    console.log(jobData);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900  p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Add New Jsob</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          Title
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            required
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
            required
          />
        </label>
        <label className="block mb-4">
          Category
          <input
            type="text"
            name="category"
            value={jobData.category}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <label className="block mb-4">
          Subcategory
          <input
            type="text"
            name="subCategory"
            value={jobData.subCategory}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <label className="block mb-4">
          Type
          <input
            type="text"
            name="type"
            value={jobData.type}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Job
        </button>
      </form>
    </div>
  );
};

export default CreateJobForm;
