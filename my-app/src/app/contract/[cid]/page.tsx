"use client";
import { redirect } from "next/navigation";
import { postRequest } from "../../../pages/api/hello";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import useSWRMutation from "swr/mutation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  deleteContractById,
  selectContracts,
  selectUser,
  selectUserToken,
  setSendingContract,
} from "../../../../store/slices/userSlice";
import { carBrands } from "../../../constants";
import { Toast } from "flowbite-react";
import { MyButton } from "../../Components/MyButton";
//TODO: CREATE SLICE
import { setMessage } from "../../../../store/slices/showSlice";
import moment from "moment";

interface FormErrors {
  email?: string;
  carBrand?: string;
  expiration?: string;
  server?: string;
}
type props = {
  params: { cid: string };
};
export default function EditContract({ params: { cid } }: props) {
  const token = useAppSelector(selectUserToken);
  const user = useAppSelector(selectUser);
  const contract = useAppSelector(selectContracts);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [errors, setErrors] = useState<FormErrors>({});
  const carBrand = useRef("");
  let timer: NodeJS.Timeout;
  useEffect(() => {
    if (user.email) setSellerEmail(user.email);
  }, [user.email]);
  useEffect(() => {
    if (contract?.sending && contract?.sending.length > 0) {
      let cont = contract?.sending.find((cont) => cont._id == cid);
      setEmail(cont?.to?.email || "");
      const exp = moment(cont?.expires).toString();
      // const exp = new Date(cont?.expires);
      console.log(new Date(exp));
      setStartDate(new Date(exp));

      carBrand.current = cont?.carBrand || "";
    }
  }, [contract?.sending.length]);
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const { trigger: EditContract, isMutating: editLoading } = useSWRMutation(
    "/api/contract/edit",
    postRequest
  );
  const { trigger: DeleteContract, isMutating: deleteLoading } = useSWRMutation(
    "/api/contract/delete",
    postRequest
  );

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
  const handleDeleteSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      console.log(carBrand.current);
      const res = await DeleteContract({
        id: cid,
      });
      const jsonRes = await res?.json();
      // console.log(jsonRes);
      if (jsonRes.success) {
        // document.querySelector(".my-toast")?.classList?.toggle("hidden");
        dispatch(deleteContractById(cid));
        dispatch(
          setMessage(`Contract of ${carBrand.current} Successfully Deleted!`)
        );
        setStartDate(new Date());
        // router.back();
      } else {
        // console.log(jsonRes.error);
        setErrors({ server: jsonRes.error });
      }
    } catch (err) {
      console.log("err", err);
    }
    // perform authentication here
  };
  const handleEditSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const changes = {
        to: email,
        carBrand: carBrand.current,
        expires: startDate,
      };
      console.log(carBrand.current);
      const res = await EditContract({
        id: cid,
        ...changes,
      });
      const jsonRes = await res?.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        document.querySelector(".my-toast")?.classList?.toggle("hidden");
        timer = setTimeout(() => {
          document.querySelector(".my-toast")?.classList?.toggle("hidden");
        }, 3500);
        dispatch(
          setSendingContract({
            to: { email },
            carBrand: carBrand.current,
            expires: startDate?.toISOString(),
          })
        );
      } else {
        console.log(jsonRes.error);
        setErrors({ server: jsonRes.error });
      }
    } catch (err) {
      console.log("err", err);
    }
    // perform authentication here
  };

  interface props {
    q: any;
  }
  function CarBrandsSearch({ q }: props) {
    const [query, setQuery] = useState<string>(q.current || "");
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
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="px-4 py-2 z-30 hover:bg-gray-100 "
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
                      <div className="flex items-center justify-center rounded-2xl bg-green-100 text-green-500 ">
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
                        Your Contract is Successfully Saved!
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
                          Seller's email address
                        </label>
                        <input
                          type="text"
                          // value={sellerEmail}
                          placeholder={sellerEmail}
                          disabled={true}
                          onChange={(event) => {
                            setEmail(event.target.value), validate();
                          }}
                          name="email-address"
                          id="email-address"
                          className="mt-1 bg-gray-50 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Buyer's email address
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  <div className="backdrop-blur bg-gray-300/60 px-4 py-3 text-right phone:text-sm sm:px-6">
                    <MyButton
                      name="Save Changes"
                      loading={editLoading}
                      handleSubmit={handleEditSubmit}
                      className="bg-slate-800/50 mx-1"
                    />
                    <MyButton
                      name="Delete"
                      loading={deleteLoading}
                      handleSubmit={handleDeleteSubmit}
                      className="bg-red-500 mx-1"
                    />
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

/*
keyS keyR => passMoney
keyS !keyR => Cancel When Expired
!keyS !keyR => doing nothing
!keyS keyR => not relevant  
*/
