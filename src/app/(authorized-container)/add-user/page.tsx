"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
  email: string;
  password: string;
  role: number;
};

interface Role {
  id: number;
  name: string;
  slug: string;
}

const AddUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getUserRoles();
  }, []);

  const addUser: SubmitHandler<Inputs> = async (addUser) => {
    try {
      const response = await axios.post("api/v1/auth/signup", {
        ...addUser,
        role: roles.find((role) => role.id == addUser.role),
      });
      if (response.data.data?.success) {
        router.push("user-list");
        toast.success(response.data.message);
      } else if (!response.data.data?.success) {
        if (response.data.statusCode == 500) {
          toast.error("There is some internal problem will be resolved soon!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  const getUserRoles = async () => {
    try {
      const response = await axios.get("api/v1/users/roles");
      if (response.data.success) {
        setRoles(response.data.result);
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
              {...register("name", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
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
              {...register("password", {
                required: true,
                minLength: 6,
                validate: validateNoWhiteSpace,
              })}
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
            <option disabled>-- Select User Role --</option>
            {roles.map((item, index) => {
              return (
                <option
                  key={item.slug}
                  className="text-gray-900"
                  value={item.id}>
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
