"use client";

import { messages } from "@/messages/frontend/index.message";
import {
  CreateMenuCategoryResponse,
  MenuCategoryApi,
  RestaurantListResponse,
  RestaurantsApi,
} from "@/swagger";
import { Restaurant } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
  restaurantId: number;
};

const AddMenuCategory = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getRestaurants();
  }, []);

  const getRestaurants = async () => {
    try {
      const restaurantsApi = new RestaurantsApi();
      restaurantsApi
        .findRestaurants({
          limit: 10,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        })
        .then((response: RestaurantListResponse) => {
          const restaurants = response.data?.rows as Restaurant[];
          setRestaurants(restaurants);
          setValue("restaurantId", restaurants[0].id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addMenuCategory: SubmitHandler<Inputs> = async (addMenuCategory) => {
    try {
      const foodItemApi = new MenuCategoryApi();
      foodItemApi
        .createMenuCategory({
          createMenuCategoryRequest: {
            name: addMenuCategory.name,
            restaurantId: addMenuCategory.restaurantId,
          },
        })
        .then((response: CreateMenuCategoryResponse) => {
          if (response.data?.success) {
            router.push("menu-category-list");
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

  return (
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">

        <div className="">
          <h1 className="md:text-4xl text-3xl mb-4 text-left text-black font-extrabold">
            Add Food Item
          </h1>
        </div>

      <div className="border rounded-xl shadow-lg bg-[#FFFFFF]">

      <div className="p-8">

        <form onSubmit={handleSubmit(addMenuCategory)}>

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

                  <p className="px-0 md:text-sm text-xs">
                    <label className="text-black" htmlFor="email">
                      Restaurant:
                    </label>
                  </p>

          <select
            className="p-3 mt-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
            id="restaurant"
            {...register("restaurantId", { required: true })}>
            <option disabled>-- Select Restaurant --</option>
            {restaurants.map((item: any, index) => {
              return (
                <option key={item.id} className="text-gray-900" value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors.restaurantId && (
            <div className="error text-red-500 text-xs absolute bottom-0 px-4">
              {messages.form.validation.restaurant.required}
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

export default AddMenuCategory;
