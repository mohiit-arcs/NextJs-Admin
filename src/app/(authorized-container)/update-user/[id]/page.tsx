"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

type Inputs = {
  name: string;
  email: string;
  role: string;
};

interface Role {
  id: number;
  name: string;
  slug: string;
}

const baseUrl = "http://localhost:3000/api/v1/users";

const UpdateUser = () => {
  const { id } = useParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();

  useEffect(() => {
    getUserDetails(Number(id));
    getUserRoles();
  }, []);

  const getUserDetails = async (userId: number) => {
    try {
      const response = await axios.get(`${baseUrl}/${userId}`);

      if (response.data.success) {
        const userData = response.data.data.details;
        setValue("name", userData.name, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("email", userData.email, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("role", userData.role.id, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserRoles = async () => {
    try {
      const response = await axios.get(`${baseUrl}/roles`);
      if (response.data.success) {
        setRoles(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser: SubmitHandler<Inputs> = async (updateUser) => {
    try {
      const role = roles.find((role) => role.id == Number(updateUser.role));
      const updatedUserData = {
        ...updateUser,
        id: Number(id),
        role: role,
      };
      const response = await axios.patch(`${baseUrl}/update`, updatedUserData);
      if (response.data.success) {
        toast.success(response.data.message);
        router.back();
      } else if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Update User</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(updateUser)}>
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

          <label className="text-black" htmlFor="role">
            Role*
          </label>
          <hr />
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
            id="role"
            {...register("role", { required: true })}>
            <option disabled>-- Select User Role --</option>
            {roles.map((item) => {
              return (
                <option key={item.id} className="text-gray-900" value={item.id}>
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

export default UpdateUser;
