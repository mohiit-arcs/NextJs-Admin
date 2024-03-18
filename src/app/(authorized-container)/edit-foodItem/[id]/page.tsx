"use client";

import axiosFetch from "@/app/axios.interceptor";
import { messages } from "@/messages/frontend/index.message";
import {
  FoodItemRequestApi,
  FoodItemsApi,
  UpdateFoodItemResponse,
} from "@/swagger";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
};

const apiUrl = "http://localhost:3000/api/v1/food-items";

const UpdateFoodItem = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getFoodItemDetail(Number(id));
  }, []);

  const getFoodItemDetail = async (foodItemId: number) => {
    try {
      const foodItemsRequestApi = new FoodItemRequestApi();
      const response = await foodItemsRequestApi.findFoodItemById({
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
      const foodItemsApi = new FoodItemsApi();
      foodItemsApi
        .updateFoodItem({
          updateFoodItemRequest: { id: Number(id), name: updateFoodItem.name },
        })
        .then((response: UpdateFoodItemResponse) => {
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
      <h1 className="text-4xl text-center text-black">Update Food Item</h1>
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

export default UpdateFoodItem;
