"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { messages } from "@/messages/frontend/index.message";
import {
  UserRequestApi,
  UserRolesApi,
  UserRolesResponse,
  UsersApi,
} from "@/swagger";

type Inputs = {
  name: string;
  email: string;
  role: number;
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
      const userRequestApi = new UserRequestApi();
      const response = await userRequestApi.findUserById({ id: userId });
      if (response.data?.details) {
        const userData = response.data.details;
        setValue("name", userData.name!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("email", userData.email!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("role", userData.role?.id!, {
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
      const userRolesApi = new UserRolesApi();
      userRolesApi.findUserRoles().then((response: UserRolesResponse) => {
        const roles = response.data?.result as Role[];
        setRoles(roles);
      });
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

      const usersApi = new UsersApi();
      const response = await usersApi.updateUser({
        updateUserRequest: updatedUserData,
      });
      if (response.data?.success) {
        toast.success(response.message);
        router.back();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">
      <div className="">
        <h1 className="md:text-4xl text-3xl mb-4 text-left text-black font-extrabold">
          Update User
        </h1>
      </div>

      <div className="border rounded-xl shadow-lg bg-[#FFFFFF]">
        <div className="p-8">
          <form onSubmit={handleSubmit(updateUser)}>
            <div className="flex gap-[6%] md:flex-row flex-col w-full ">
              <div className="flex flex-col md:w-[47%] w-full">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Name:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    type="text"
                    id="name"
                    autoComplete="off"
                    placeholder="Name"
                    {...register("name", {
                      required: true,
                    })}
                  />
                  {errors.name && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.name.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Email:
                    </label>
                  </p>
                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    type="text"
                    id="email"
                    autoComplete="off"
                    placeholder="Email"
                    {...register("email", {
                      required: true,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/,
                        message: messages.form.validation.email.invalid,
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.email.type === "required" &&
                        messages.form.validation.email.required}
                      {errors.email.type === "pattern" &&
                        messages.form.validation.email.invalid}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:w-[47%] w-full">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Role:
                    </label>
                  </p>

                  <select
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    id="role"
                    {...register("role", { required: true })}>
                    <option disabled>-- Select User Role --</option>
                    {roles.map((item) => {
                      return (
                        <option
                          key={item.id}
                          className="text-gray-900"
                          value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors.role && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.role.required}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#EBA232] hover:bg-[#cc861d] m-2 py-3 text-white rounded-[8px] w-[150px]">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
