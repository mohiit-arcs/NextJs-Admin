"use client";

import HeaderTitle from "@/components/ui/HeaderTitle/HeaderTitle";
import { messages } from "@/messages/frontend/index.message";
import {
  AuthenticationApi,
  SignupResponse,
  UserRolesApi,
  UserRolesResponse,
} from "@/swagger";
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
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getUserRoles();
  }, []);

  const addUser: SubmitHandler<Inputs> = async (addUser) => {
    try {
      const authApi = new AuthenticationApi();
      authApi
        .signup({
          signupRequest: {
            name: addUser.name,
            email: addUser.email,
            password: addUser.password,
            role: roles.find((role) => role.id == addUser.role),
          },
        })
        .then((response: SignupResponse) => {
          if (response.data?.success) {
            router.push("user-list");
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  const getUserRoles = async () => {
    try {
      const userRolesApi = new UserRolesApi();
      userRolesApi.findUserRoles().then((response: UserRolesResponse) => {
        const roles = response.data?.result as Role[];
        setRoles(roles);
        setValue("role", roles[0]?.id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">
      <HeaderTitle title="Add User"></HeaderTitle>

      <div className="border rounded-xl shadow-lg bg-[#FFFFFF]">
        <div className="p-8">
          <form onSubmit={handleSubmit(addUser)}>
            <div className="flex gap-[6%] md:flex-row flex-col w-full ">
              <div className="flex flex-col md:w-[47%] w-full">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Name:
                    </label>
                  </p>

                  <div className="flex justify-center items-center">
                    <input
                      className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
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

                  <div className="flex justify-center items-center">
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
                  </div>
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
                      Password:
                    </label>
                  </p>

                  <div className="flex justify-center items-center">
                    <input
                      className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
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
                      className="-ml-9 mb-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye color="black" />
                      ) : (
                        <EyeOff color="black" />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.password.type == "minLength" &&
                        messages.form.validation.password.minChar}
                      {errors.password.type == "required" &&
                        messages.form.validation.password.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Role:
                    </label>
                  </p>

                  <select
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    id="role"
                    {...register("role", { required: true })}
                  >
                    <option disabled>-- Select User Role --</option>
                    {roles.map((item, index) => {
                      return (
                        <option
                          key={item.slug}
                          className="text-gray-900"
                          value={item.id}
                        >
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
              className="bg-[#EBA232] hover:bg-[#cc861d] m-2 py-3 text-white rounded-[8px] w-[150px]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
