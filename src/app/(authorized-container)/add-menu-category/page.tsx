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
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Add Food Item</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(addMenuCategory)}>
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
          <label className="text-black" htmlFor="restaurant">
            Restaurant*
          </label>
          <hr />
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
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
            <div className="error text-red-500">
              {messages.form.validation.restaurant.required}
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

export default AddMenuCategory;
