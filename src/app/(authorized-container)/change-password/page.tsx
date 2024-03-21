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
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Change password</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-black" htmlFor="currentPassword">
            Current Password
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              {...register("currentPassword")}
            />
            <div
              className="-ml-7 cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? (
                <Eye color="black" />
              ) : (
                <EyeOff color="black" />
              )}
            </div>
          </div>
          {errors.currentPassword && (
            <span className="text-red-500">
              {errors.currentPassword.message}
            </span>
          )}
          <hr />
          <hr />
          <label className="text-black" htmlFor="newPassword">
            New Password
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="password"
              id="newPassword"
              {...register("newPassword")}
            />
          </div>
          {errors.newPassword && (
            <span className="text-red-500">{errors.newPassword.message}</span>
          )}
          <br />
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

export default ChangePassword;
