import React from "react";
import JobCard from "./JobCard";
import { JobsType } from "store/slices/userSlice";
import { postRequest } from "pages/api/hello";
import useSWRMutation from "swr/mutation";

interface JobListProps {
  jobs: JobsType[];
  showApply?: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, showApply = true }) => {
  const { trigger: applyToJob } = useSWRMutation(
    "/api/jobs/apply",
    postRequest
  );
  const onApply = async (jobId?: string) => {
    const returnData = await applyToJob({ jobId });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs?.map((job, index) => (
        <JobCard
          key={job._id}
          job={job}
          onApply={onApply}
          showApply={showApply}
        />
      ))}
    </div>
  );
};

export default JobList;
