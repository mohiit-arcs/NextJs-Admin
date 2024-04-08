"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ChangePasswordResponse, MeApi } from "@/swagger";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object({
        currentPassword: yup
          .string()
          .required("Please enter your current password"),
        newPassword: yup
          .string()
          .required("Please enter a new password")
          .min(6, "New password must be at least 6 characters long")
          .notOneOf(
            [yup.ref("currentPassword")],
            "New password cannot match current password"
          ),
      })
    ),
  });

  const onSubmit = async (data: any) => {
    try {
      const changePasswordApi = new MeApi();
      changePasswordApi
        .changePassword({
          changePasswordRequest: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        })
        .then((response: ChangePasswordResponse) => {
          if (response.data?.success) {
            toast.success(response?.message);
            router.push("/dashboard");
          } else {
            toast.error(response.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 p-10 min-h-screen ">

      <div className="px-44">
        <h1 className="text-4xl text-left text-black font-extrabold px-4">
          Change Password
        </h1>
      </div>

      <div className="py-8 px-44">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="flex gap-[6%] flex-row w-full ">

           <div className="flex flex-col w-[47%]"> */}

          <div className="relative">
            <p className="px-4 py-3 text-sm">
              <label className="text-black" htmlFor="currentPassword">
                Current Password
              </label>
            </p>

            <input
              className="p-3 mb-5 w-1/2 text-black rounded-full text-sm"
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              {...register("currentPassword")}
            />

            <div
              className="-ml-7 cursor-pointer absolute top-[50%] left-[48%]"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <Eye color="black" />
              ) : (
                <EyeOff color="black" />
              )}
            </div>

            {errors.currentPassword && (
              <span className="text-red-500">
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          <div className="relative">
            <p className="px-4 py-3 text-sm">
              <label className="text-black" htmlFor="newPassword">
                New Password
              </label>
            </p>

            <input
              className="p-3 mb-5 w-1/2 text-black rounded-full text-sm"
              type="password"
              id="newPassword"
              {...register("newPassword")}
            />

            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 m-2 py-3 text-white rounded-full w-[150px]"
          >
            Submit
          </button>
        </form>
      </div>
      </div>
  );
};

export default ChangePassword;
