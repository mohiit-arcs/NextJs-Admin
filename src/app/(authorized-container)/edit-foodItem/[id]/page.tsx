"use client";

import HeaderTitle from "@/components/ui/HeaderTitle/HeaderTitle";
import { messages } from "@/messages/frontend/index.message";
import { FoodItemRequestApi, FoodItemsApi } from "@/swagger";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
  price: number;
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
        setValue("price", restaurantData?.price!, {
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
      const response = await foodItemsApi.updateFoodItem({
        updateFoodItemRequest: {
          id: Number(id),
          name: updateFoodItem.name,
          price: updateFoodItem.price,
        },
      });
      if (response.data?.success) {
        router.push("food-item-list");
        toast.success(response.message);
        router.back();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  return (
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">
      <HeaderTitle title="Update Food Item"></HeaderTitle>

      <div className="mt-4 border rounded-xl shadow-lg bg-[#FFFFFF]">
        <div className="p-8">
          <form onSubmit={handleSubmit(updateFoodItem)}>
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
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.name && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.name.required}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:w-[47%] w-full">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Price:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    type="text"
                    id="price"
                    autoComplete="off"
                    placeholder="Price"
                    {...register("price", {
                      required: true,
                      validate: (value) => value != 0,
                    })}
                  />

                  {errors.price && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.price.required}
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

export default UpdateFoodItem;
