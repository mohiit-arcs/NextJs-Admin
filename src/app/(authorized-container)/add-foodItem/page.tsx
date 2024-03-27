"use client";

import { messages } from "@/messages/frontend/index.message";
import {
  CreateFoodItemResponse,
  FoodItemsApi,
  MenuCategoriesApi,
  MenuCategoriesResponse,
  RestaurantListResponse,
  RestaurantsApi,
} from "@/swagger";
import { Restaurant } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
  price: number;
  restaurantId: number;
  categoryId: number;
};

interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

const AddFoodItem = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
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
    getMenuCategories();
  }, []);

  const addFoodItem: SubmitHandler<Inputs> = async (addFoodItem) => {
    try {
      const foodItemApi = new FoodItemsApi();
      foodItemApi
        .createFoodItem({ createFoodItemRequest: addFoodItem })
        .then((response: CreateFoodItemResponse) => {
          if (response.data?.success) {
            router.push("food-item-list");
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

  const getMenuCategories = async () => {
    try {
      const menuCategoriesApi = new MenuCategoriesApi();
      menuCategoriesApi
        .findMenuCategories()
        .then((response: MenuCategoriesResponse) => {
          const menuCategories = response.data?.result as MenuCategory[];
          setMenuCategories(menuCategories);
          setValue("categoryId", menuCategories[0].id);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Add Food Item</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(addFoodItem)}>
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
          <label className="text-black" htmlFor="price">
            Price*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="price"
              autoComplete="off"
              placeholder="Price"
              {...register("price", {
                required: true,
                validate: (value) => value != 0,
              })}
            />
          </div>
          {errors.price && (
            <div className="error text-red-500">
              {messages.form.validation.price.required}
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
          {errors.categoryId && (
            <div className="error text-red-500">
              {messages.form.validation.restaurant.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="menu-category">
            Menu Category*
          </label>
          <hr />
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
            id="menu-category"
            {...register("categoryId", { required: true })}>
            <option disabled>-- Select Category --</option>
            {menuCategories.map((item, index) => {
              return (
                <option
                  key={item.slug}
                  className="text-gray-900"
                  value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors.categoryId && (
            <div className="error text-red-500">
              {messages.form.validation.menuCategory.required}
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

export default AddFoodItem;
