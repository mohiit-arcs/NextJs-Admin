"use client";
import { useUserProfile } from "@/components/user-profile/page";
import { messages } from "@/messages/frontend/index.message";
import { setAuthToken } from "@/services/frontend/storage.service";
import { AuthenticationApi, LoginResponse } from "@/swagger";
import { RoleSlug } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { setUserProfile } = useUserProfile();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onLogin: SubmitHandler<Inputs> = async (login) => {
    try {
      const authApi = new AuthenticationApi();
      authApi
        .login({
          loginRequest: {
            email: login.email,
            password: login.password,
          },
        })
        .then((response: LoginResponse) => {
          console.log(response);
          if (response.data?.profile) {
            const token = response.data.token;
            setUserProfile(response.data.profile);
            setAuthToken(token);
            if (response.data.profile.role?.slug === RoleSlug.superAdmin) {
              router.push("/user-list");
              toast.success(response.message);
            } else if (
              response.data.profile.role?.slug === RoleSlug.restaurantAdmin
            ) {
              router.push("/restaurant-list");
              toast.success(response.message);
            } else {
              router.push("/dashboard");
              toast.success(response.message);
            }
          } else {
            toast.error(response.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-orange-100 h-screen flex flex-row">
      <div className="flex-1 p-4 flex flex-row justify-center items-center">
        <div className="w-1/2">
          <div className="w-full mb-16 flex flex-row items-center">
            <img
              className="w-16"
              src="assets/images/bgImages/logo.png"
              alt=""
            />
            <span className="text-2xl font-bold text-[#592D00]">M</span>
            <span className="text-4xl font-bold text-[#e9981c]">O</span>
            <span className="text-2xl font-bold text-[#592D00]">H</span>
            <span className="text-4xl font-bold text-[#e9981c]">I</span>
            <span className="text-2xl font-bold text-[#592D00]">Y</span>
            <span className="text-4xl font-bold text-[#e9981c]">U</span>
            <span className="text-2xl font-bold text-[#592D00]">M</span>
          </div>

          <div className="pb-9">
            <h1 className="text-[#1E293B] font-extrabold text-4xl leading-7 mb-4 tracking-wider">
              Login
            </h1>
            <span className="text-[#6474A3] font-normal text-sm tracking-wider">
              Enter your credentials to login
            </span>
          </div>

          <div className="">
            <form onSubmit={handleSubmit(onLogin)}>
              <label
                className="text-[#0F172A] mb-2 font-semibold text-sm tracking-wider"
                htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="mb-7">
                  <input
                    className=" text-[#1E293B] bg-[#FFFFFF] p-4 mt-2 rounded-lg border
                focus:outline-none focus:border-[#F58220] border-[#E2E8F0] w-full"
                    type="text"
                    id="email"
                    autoComplete="off"
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
                  <div className=" absolute text-xs top-[70px] text-[red]">
                    {errors.email.type === "required" &&
                      messages.form.validation.email.required}
                    {errors.email.type === "pattern" &&
                      messages.form.validation.email.invalid}
                  </div>
                )}
              </div>
              <label
                className="text-[#0F172A] mb-2 font-semibold text-sm tracking-wider"
                htmlFor="password">
                Password
              </label>
              <div className="mb-9 relative">
                <div className="flex flex-row items-center mb-2">
                  <input
                    className="text-[#1E293B] bg-[#FFFFFF] p-4 mt-2 rounded-l-lg border
                focus:outline-none focus:border-[#F58220] border-[#E2E8F0] w-10/12"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="off"
                    {...register("password", {
                      required: true,
                    })}
                  />
                  <button
                    className="w-2/12 bg-[#FFFFFF] border-t border-r border-b border-[#E2E8F0] rounded-r-lg p-4 ml-px mt-2"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <Eye color="black" />
                    ) : (
                      <EyeOff color="black" />
                    )}
                  </button>
                </div>
                {/* <span className="flex flex-row justify-end text-[#475569] text-sm underline underline-offset-1"><a className="" href="">Forgot Password?</a></span> */}
                {errors.password && (
                  <div className="absolute text-xs top-[70px] text-[red]">
                    {messages.form.validation.password.required}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="mb-7 w-full py-4 rounded-lg bg-[#eba232] hover:bg-[#e9981c] text-[#FFFFFF] tracking-wider">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-row justify-center items-center">
        <img
          className="transform scale-x-[-1] mt-10 h-[34rem]"
          src="assets/images/bgImages/boy.png"
          alt=""
        />
      </div>
    </div>
  );
}
