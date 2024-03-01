"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roles = [
  { name: "Restaurant Admin", slug: "restaurantAdmin" },
  { name: "Delivery Partner", slug: "deliveryPartner" },
  { name: "Customer", slug: "customer" },
];

type Inputs = {
  name: string;
  email: string;
  password: string;
  role: number;
};

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const addUser: SubmitHandler<Inputs> = async (addUser) => {
    try {
      const response = await axios.post("api/v1/auth/signup", {
        ...addUser,
        role: roles[addUser.role],
      });
      if (response.data.success) {
        reset();
        toast.success(response.data.message);
      } else if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Add User</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(addUser)}>
          <label className="text-black" htmlFor="name">
            Name*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="name"
              autoComplete="off"
              placeholder="Name"
              {...register("name", { required: true })}
            />
          </div>
          {errors.name && (
            <div className="error text-red-500">Please enter name</div>
          )}
          <hr />
          <label className="text-black" htmlFor="email">
            Email*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="email"
              autoComplete="off"
              placeholder="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value:
                    /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/,
                  message: "Please enter correct email",
                },
              })}
            />
          </div>
          {errors.email && (
            <div className="error text-red-500">
              {errors.email.type === "required" && "Please enter email"}
              {errors.email.type === "pattern" &&
                "Please enter a valid email address"}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="password">
            Password*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
            />
            <div
              className="-ml-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye color="black" /> : <EyeOff color="black" />}
            </div>
          </div>
          {errors.password && (
            <div className="error text-red-500">
              {errors.password.type == "minLength" &&
                "Password must be of 6 letters"}
              {errors.password.type == "required" && "Enter your password"}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="role">
            Role*
          </label>
          <hr />
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
            id="role"
            {...register("role", { required: true })}>
            <option disabled>
              -- Select User Role --
            </option>
            {roles.map((item, index) => {
              return (
                <option key={item.slug} className="text-gray-900" value={index}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors.role && (
            <div className="error text-red-500">Please select role</div>
          )}
          <hr />
          <hr />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-full">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
