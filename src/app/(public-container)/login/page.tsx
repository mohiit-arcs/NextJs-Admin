"use client";
import { setAuthToken } from "@/services/frontend/storage.service";
import axios from "axios";
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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onLogin: SubmitHandler<Inputs> = async (login) => {
    try {
      const response = await axios.post("api/v1/auth/login", login);
      if (response.data.success) {
        const token = response.data.token;
        setAuthToken(token);
        if (response.data.profile.role === "superAdmin") {
          router.push("/user-list");
          toast.success(response.data.message);
        } else {
          router.push("/restaurant-list");
          toast.success(response.data.message);
        }
      } else if (!response.data.success) {
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

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center pt-4 text-black">Log In</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(onLogin)}>
          <label className="text-black" htmlFor="email">
            Email*
          </label>
          <div>
            <div className="flex justify-center items-center">
              <input
                className="w-72 p-3 text-black"
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
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <div className="error text-red-500">
                {errors.email.type === "required" && "Please enter email"}
                {errors.email.type === "pattern" &&
                  "Please enter a valid email address"}
              </div>
            )}
          </div>
          <hr />
          <hr />
          <label className="text-black" htmlFor="password">
            Password*
          </label>
          <div>
            <div className="flex justify-center items-center">
              <input
                className="p-3 w-72 text-black"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="off"
                {...register("password", {
                  required: true,
                })}
                placeholder="Password"
              />
              <div
                className="-ml-9 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye color="black" />
                ) : (
                  <EyeOff color="black" />
                )}
              </div>
            </div>
            {errors.password && (
              <div className="error text-red-500">Please enter password</div>
            )}
          </div>

          <hr />
          <hr />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 m-2 p-2 text-white rounded-md w-full">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
