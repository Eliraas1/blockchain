import Jobs, { JobsType } from "Models/Jobs";
import User, { UserType } from "Models/User";

export interface CreateJobProps {
  carBrand?: string;
  expires?: Date;
  to?: string;
}
export async function createJob(_id: string, job: JobsType) {
  try {
    const { title, description, location, category } = job;
    if (!title) throw new Error("Title is required");
    if (!description) throw new Error("Description is required");
    if (!location) throw new Error("Location is required");
    if (!category) throw new Error("Category is required");

    const user = await User.findOne({ _id });
    if (!user) throw new Error("user not Logged in!");
    const createdJob = await new Jobs({
      ...job,
      user,
    } as any);
    await createdJob.save();
    const updatedUser = await User.findByIdAndUpdate(
      { _id },
      { $addToSet: { jobs: createdJob._id } },
      { new: true }
    );
    return createdJob;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function getJobById(_id: string) {
  try {
    const jobs: JobsType[] = await Jobs.findById(_id)
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "user",
          select: "-password",
        },
      ])
      .populate("appliedUsers");
    return jobs;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function getUserJobs(userId: string) {
  try {
    const user = await User.findById(userId)
      .populate("jobs")
      .populate("appliedTo");
    return { jobs: user.jobs, appliedTo: user.appliedTo };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
// {title : 'electrical ', description:" blah"}
export async function getJobByField(field: any) {
  try {
    const types: string[] = [];
    if (field.type) {
      types[0] = field.type;
      const charToReplace = (field.type as string).includes("-") ? "-" : " ";
      const replaceTo = (field.type as string).includes("-") ? " " : "-";
      types[1] = (field.type as string).replace(charToReplace, replaceTo);
    }

    const query = {
      ...(field.location && {
        location: { $regex: field.location, $options: "i" },
      }),
      ...(field.title && {
        title: { $regex: field.title, $options: "i" },
      }),
      ...(field.type && {
        type: { $in: types },
      }),
      ...(field.category && {
        category: field.category,
      }),
      ...(field.description && {
        description: { $regex: field.description, $options: "i" },
      }),
    };

    console.log("in server, query", field, query);
    const jobs: JobsType[] = await Jobs.find(query)
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "user",
          select: "-password",
        },
      ]);
    return jobs;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}

export async function editJob(jobId: string, details: JobsType) {
  try {
    const { title, description, location, category, type } = details;
    if (!title) throw new Error("Title is required");
    if (!description) throw new Error("Description is required");
    if (!location) throw new Error("Location is required");
    if (!category) throw new Error("Category is required");
    if (!type) throw new Error("Type is required");

    const createdJob = await Jobs.findByIdAndUpdate(
      {
        _id: jobId,
      },
      details,
      { new: true }
    );
    return createdJob;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function applyJob(userId: string, jobId: string) {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { appliedTo: jobId } },
      { new: true }
    )
      .populate("jobs")
      .populate("appliedTo");
    const job = await Jobs.findByIdAndUpdate(
      { _id: jobId },
      { $addToSet: { appliedUsers: user } },
      { new: true }
    ).populate("user");

    return { user, job };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function deleteJob(jobId: string) {
  try {
    const job: JobsType | null = await Jobs.findOneAndDelete({
      _id: jobId,
    });
    if (!job) throw new Error("contract not found");
    return { job };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function getJobs() {
  try {
    const jobs: JobsType[] | null = await Jobs.find();
    return { jobs };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
