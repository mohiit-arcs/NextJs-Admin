"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { MeApi } from "@/swagger";
import { useRouter } from "next/navigation";
import HeaderTitle from "@/components/ui/HeaderTitle/HeaderTitle";

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
      const response = await changePasswordApi.changePassword({
        changePasswordRequest: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      if (response.data?.success) {
        toast.success(response?.message);
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">

     <HeaderTitle title="Change Password"></HeaderTitle> 

      <div className="mt-4 border rounded-xl shadow-lg bg-[#FFFFFF]">

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-[6%] flex-col md:flex-row w-full ">
              <div className="flex flex-col w-full md:w-[47%]">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Current Password:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    {...register("currentPassword")}
                  />

                  <div
                    className="-ml-7 cursor-pointer absolute top-[45%] left-[98%]"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }>
                    {showCurrentPassword ? (
                      <Eye color="black" />
                    ) : (
                      <EyeOff color="black" />
                    )}
                  </div>

                  {errors.currentPassword && (
                    <span className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.currentPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:w-[47%] w-full">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      New Password:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    type="password"
                    id="newPassword"
                    {...register("newPassword")}
                  />

                  {errors.newPassword && (
                    <span className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.newPassword.message}
                    </span>
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

export default ChangePassword;
