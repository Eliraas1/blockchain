import Link from "next/link";
import React, { useCallback } from "react";
import { JobsType } from "store/slices/userSlice";
const defaultBrandImg = "https://www.svgrepo.com/show/38099/brand.svg";

interface JobCardProps {
  job: JobsType;
  onApply: (jobId?: string) => void;
  showApply: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, showApply }) => {
  const { title, description, location, type, subCategory, _id } = job;
  const handleApply = useCallback(() => {
    console.log({ _id });
    onApply(_id);
  }, [_id, onApply]);

  // <Link
  //                     href={`contract/${cont._id}`}
  //                     className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
  //                   ></Link>

  const redirectToJobAppliedUser = () => {};
  return (
    <div className="bg-white shadow-md rounded-md p-4 justify-center text-center relative">
      {/* Job Type (Full time or Part time) */}
      <p className="text-gray-600 mb-2 absolute top-1 left-1">
        <span className="bg-green-500 text-white rounded-md py-1 px-2">
          {type}
        </span>
      </p>
      {/* Job Logo (if available) */}
      <div className="flex justify-center mb-2">
        <img
          src={job.user?.img || defaultBrandImg}
          alt={title}
          className="w-16 h-16 object-cover mb-2 rounded-md"
        />
      </div>
      {/* Job Title */}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">{subCategory || "Not specified"}</p>
      {/* Job Location */}
      <p className="text-gray-600 mb-2">{location}</p>

      {/* Job Description */}
      <p className="text-gray-600 mb-2">{description}</p>
      {/* Additional job details */}
      {/* You can add additional job details here as needed */}
      {/* Apply Button */}
      {showApply && (
        <button
          className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
          onClick={handleApply}
        >
          Apply
        </button>
      )}
      {true && (
        <Link
          className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
          // onClick={handleApply}
          href={`my-job/${_id}`}
        >
          Details
        </Link>
      )}
    </div>
  );
};

export default JobCard;
