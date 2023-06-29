"use client";
// import { useRouter } from "next/navigation";
import { postRequest } from "../../pages/api/hello";
import React, { useEffect, useId, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import useSWRMutation from "swr/mutation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { selectUser, selectUserToken } from "../../../store/slices/userSlice";
import { carBrands } from "../../constants";
import { Toast } from "flowbite-react";
import { v4 } from "uuid";

import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useMetamask,
} from "@thirdweb-dev/react";
import toast from "react-hot-toast";
interface FormErrors {
  email?: string;
  carBrand?: string;
  expiration?: string;
  server?: string;
}
const WALLET_ID = process.env.NEXT_PUBLIC_WALLET_ID;
export default function CreateContract() {
  // const router = useRouter();

  const { contract } = useContract(WALLET_ID);
  const { data: contractData } = useContractRead(contract, "carSales", [1]);

  const address = useAddress();
  const connectWallet = useMetamask();

  const {
    mutateAsync: createContract,
    isLoading: createContractLoading,
    error: createContractErr,
  } = useContractWrite(contract, "createSale");

  const token = useAppSelector(selectUserToken);

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [errors, setErrors] = useState<FormErrors>({});
  const carBrand = useRef("");
  useEffect(() => {
    if (user.email) setSellerEmail(user.email);
  }, [user.email]);
  const {
    trigger: CreateContract,
    data,
    error,
    isMutating,
  } = useSWRMutation("/api/contract/create", postRequest);
  //   console.log("asdasdasd", token);
  //   if (!token) redirect("/login");
  const validate = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!startDate) {
      newErrors.expiration = "Expiration date is required";
    }
    if (!carBrand.current) {
      newErrors.carBrand = "Car Brand is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!address) await connectWallet();
    console.log(email, sellerEmail);
    const ss = await createContract({
      args: [
        "0xa509def675E9FD6914FFE7E52bAfFC675B5e665C",
        "0xa509def675E9FD6914FFE7E52bAfFC675B5e665C",
        1,
      ],
    });
    console.log(ss.receipt);
    return;
    try {
      console.log(carBrand.current);
      const res = await CreateContract({
        to: email,
        carBrand: carBrand.current,
        expires: startDate,
      });
      const jsonRes = await res?.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        console.log(jsonRes.data);
        document.querySelector(".my-toast")?.classList?.toggle("hidden");
        setEmail("");
        setStartDate(undefined);
        // dispatch(login({ ...jsonRes.data.user }));
      } else {
        console.log(jsonRes.message);
        setErrors({ server: jsonRes.message });
      }
    } catch (err) {
      console.log("err", err);
      console.log("error", error);
    }
    // perform authentication here
  };

  interface props {
    q: any;
  }
  function CarBrandsSearch({ q }: props) {
    const [query, setQuery] = useState<string>("");
    const [options, setOptions] = useState<string[]>(carBrands);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isOptionClicked, setIsOptionClicked] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
      optionRefs.current = optionRefs.current.slice(0, options.length);
    }, [options]);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setQuery(value);
      q.current = value;

      // Filter the options based on the input value
      const filteredOptions = carBrands.filter((brand: string) =>
        brand.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(filteredOptions);
      inputRef.current?.focus();
    }

    function handleInputFocus() {
      setIsFocused(true);
    }

    function handleInputBlur() {
      if (!isOptionClicked) {
        setIsFocused(false);
      }
      setIsOptionClicked(false);
    }

    function handleOptionClick(brand: string) {
      setQuery(brand);
      q.current = brand;
      setOptions([]);
    }

    return (
      <div className="relative">
        <input
          ref={inputRef}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-500"
          type="text"
          placeholder="Search for a car brand"
          value={q.current}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {isFocused && options.length > 0 && (
          <ul
            className="absolute z-30 left-0 right-0 mt-2 py-2 bg-white rounded-md shadow-lg max-h-32 overflow-y-scroll"
            onMouseDown={() => setIsOptionClicked(true)}
            onMouseUp={() => setIsOptionClicked(false)}
          >
            {options.map((option, index) => {
              return (
                <li
                  ref={(ref) => {
                    optionRefs.current[index] = ref;
                  }}
                  key={option}
                  className="px-4 py-2 z-30 hover:bg-gray-100 text-gray-500 bg-yellow-100 "
                  onClick={(event) => {
                    setIsOptionClicked(true);
                    handleOptionClick(option);
                    inputRef.current?.focus();
                  }}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-screen  overflow-x-hidden z-10 place-content-center ">
      <div className="w-[50rem] h-[100%] opacity-[0.93]  px-10 flex-col pt-11 z-0">
        <div className="mt-10 sm:mt-0">
          <div className="">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="backdrop-blur bg-gray-300/60 animate__animated animate__fadeInDown overflow-hidden  shadow-2xl sm:rounded-md">
                  <div className="px-4 py-5">
                    <div className="px-4 sm:px-0 ">
                      <h3 className="text-3xl mt-2 font-medium leading-6 text-gray-900">
                        Contract Information
                      </h3>
                      <p className="mt-2 mb-2 text-lg font-medium text-gray-600">
                        Use a permanent address where you can receive mail.
                      </p>
                    </div>
                    <Toast className="my-toast hidden bg-green-200 mb-2 min-w-fit">
                      <div className="flex items-center justify-center rounded-2xl bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
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
                        Your Contract is Successfully created!
                      </div>
                      <Toast.Toggle className="hover:bg-green-100 ml-2 bg-green-200" />
                    </Toast>
                  </div>
                  <div className=" px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-5 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Seller&apos;s email address
                        </label>
                        <input
                          type="text"
                          // value={sellerEmail}
                          placeholder={sellerEmail}
                          disabled={false}
                          onChange={(event) => {
                            setSellerEmail(event.target.value), validate();
                          }}
                          name="email-address"
                          id="email-address"
                          className="mt-1 bg-gray-50 text-gray-500 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Buyer&apos;s email address
                        </label>
                        <input
                          type="text"
                          value={email}
                          placeholder="Email address of the buyer"
                          required
                          onChange={(event) => {
                            setEmail(event.target.value), validate();
                          }}
                          name="email-address"
                          id="email-address"
                          autoComplete="email"
                          className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Car Brand
                        </label>

                        <CarBrandsSearch q={carBrand} />
                      </div>
                      <div className="col-span-6 sm:col-span-3 ">
                        <label
                          htmlFor="datePicker"
                          className="block text-sm pb-2 font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <div className="relative ">
                          <div className="flex z-10 absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>

                          <DatePicker
                            selected={startDate}
                            id="datePicker"
                            onChange={(date) => setStartDate(date as Date)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Select date"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur bg-gray-300/60 px-4 py-3 text-right sm:px-6">
                    <button
                      onClick={handleSubmit}
                      className="inline-flex justify-center bg-slate-800/50 rounded-md border border-transparent  hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline flex-row  items-center  "
                      type="submit"
                    >
                      Create Contract
                      {isMutating && (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className=" ml-4 w-5  text-gray-200 animate-spin dark:text-gray-600 fill-white"
                            viewBox="0 0 100 100"
                            //   width={1000}
                            height={25}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      )}
                    </button>
                    {errors.server && (
                      <p className="text-red-500 text-xs italic mt-2">
                        {errors.server}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
