import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JobSubType } from "Models/Jobs";
import { RootState } from "store/store";

// Define a type for the slice state
export interface UserState {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  isSignIn?: boolean;
  img?: string;
  jobs: JobsType[];
  appliedTo: JobsType[];
  description?: string;
  token?: string;
  emailFromRegister?: string;
}
export interface JobsType {
  _id?: string;
  user?: UserState;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  subCategory?: string;
  type?: JobSubType;
  createdAt?: Date;
  updatedAt?: Date;
  appliedUsers?: UserState[];
}
// Define the initial state using that type
const initialState: UserState = {
  _id: "",
  name: "New User",
  email: "",
  emailFromRegister: "",
  password: "",
  description: "",
  img: undefined,
  jobs: [],
  appliedTo: [],
  isSignIn: false,
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      console.log({ acrion: action.payload });
      state = { ...state, ...action.payload };
      return state;
    },
    login: (state, action: PayloadAction<UserState>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    logout: (state) => {
      state = { ...initialState };
      return state;
    },
    setJobs: (state, action: PayloadAction<JobsType>) => {
      state.jobs?.push(action.payload);
      return state;
    },

    deleteJobById: (state, action: PayloadAction<string>) => {
      const index = state.jobs?.findIndex(
        (item) => item._id === action.payload
      );
      if (~index && state.jobs[index]) state.jobs.splice(index, 1);
      return state;
    },
    editJob: (state, action: PayloadAction<JobsType>) => {
      const { _id } = action.payload;
      const index = state.jobs.findIndex((item) => item._id === _id);
      state.jobs[index] = { ...action.payload };
      return state;
    },
    apply: (state, action: PayloadAction<JobsType>) => {
      const newJobId = action.payload._id;

      const isExist =
        state.appliedTo.filter((item) => item._id === newJobId)?.length > 0;
      !isExist && state.appliedTo.push(action.payload);
      return state;
    },
  },
});

export const {
  setUser,
  login,
  logout,
  setJobs,
  editJob,
  apply,
  deleteJobById,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;
export const selectUserToken = (state: RootState) => state.user.token;
export const selectIsSignIn = (state: RootState) => state.user.isSignIn;
export const selectEmailFromRegister = (state: RootState) =>
  state.user.emailFromRegister;
export const selectJobs = (state: RootState) => state.user.jobs;
export const selectApplyJobs = (state: RootState) => state.user.appliedTo;
export default userSlice.reducer;
