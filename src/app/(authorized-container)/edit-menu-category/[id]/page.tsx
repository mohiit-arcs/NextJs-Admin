"use client";

import { messages } from "@/messages/frontend/index.message";
import {
  MenuCategoryApi,
  MenuCategoryRequestApi,
  UpdateMenuCategoryResponse,
} from "@/swagger";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
  price: number;
};

const UpdateMenuCategory = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getMenuCategoryDetail(Number(id));
  }, []);

  const getMenuCategoryDetail = async (foodItemId: number) => {
    try {
      const menuCategoryApi = new MenuCategoryRequestApi();
      const response = await menuCategoryApi.findMenuCategoryById({
        id: foodItemId,
      });

      if (response.data) {
        const restaurantData = response.data.details;
        setValue("name", restaurantData?.name!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateFoodItem: SubmitHandler<Inputs> = async (updateFoodItem) => {
    try {
      const foodItemsApi = new MenuCategoryApi();
      foodItemsApi
        .updateMenuCategory({
          updateMenuCategoryRequest: {
            id: Number(id),
            name: updateFoodItem.name,
          },
        })
        .then((response: UpdateMenuCategoryResponse) => {
          if (response.data?.success) {
            router.push("food-item-list");
            toast.success(response.message);
            router.back();
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

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Update Menu Category</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(updateFoodItem)}>
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
            <div className="error text-red-500">
              {messages.form.validation.name.required}
            </div>
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

export default UpdateMenuCategory;
