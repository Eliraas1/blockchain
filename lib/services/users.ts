// import Jobs from "Models/Jobs";
import Jobs, { JobsType } from "Models/Jobs";
import User, { UserType } from "Models/User";
// import { applyJob } from "./jobs.service";

export async function getUsers() {
  try {
    const users = await User.find();
    return { users };
  } catch (error: any) {
    return { error };
  }
}

export async function createUser(user: any) {
  try {
    if (!user.email) throw new Error("Email Is Required");
    const email = user.email.toLowerCase();
    const found = await User.findOne({ email });
    if (found) throw new Error("Email Already Exist");
    const createdUser: UserType = await new User({
      ...user,
      email,
    });
    await createdUser.save();
    return createdUser;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await User.findById(id).populate(["jobs", "appliedTo"]);
    return user;
  } catch (error: any) {
    return { error };
  }
}
export const getUserByEmail = async (
  emailAddress: string,
  password: boolean = false
): Promise<UserType> => {
  let user;
  const email = emailAddress.toLowerCase().trim();
  try {
    if (password) {
      user = await User.findOne({
        email,
      }).select("+password");
      // .populate("jobs")
      // .populate("appliedTo");
      const { jobs, appliedTo } = user ?? {};
      const allJobs = await Jobs.find({ _id: { $in: jobs } });
      const allAppliedTo = await Jobs.find({ _id: { $in: appliedTo } });
      user.jobs = allJobs;
      user.appliedTo = allAppliedTo;
    } else {
      console.log({ email });
      user = await User.findOne({
        email,
      })
        .populate("jobs")
        .populate("appliedTo");
    }
    // const newJob = new Jobs({
    //   title: "BI Developer",
    //   description: "A job description",
    //   location: "Beer-Sheva, Israel",
    //   category: "Technology",
    //   subCategory: "Web Development",
    //   type: "Full time",
    //   user,
    // } as any);
    // await newJob.save();
    // await applyJob(user._id, newJob._id as string);
    return user as UserType;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
