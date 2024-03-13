"use client";

import axiosFetch from "@/app/axios.interceptor";
import { messages } from "@/messages/frontend/index.message";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
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
  const [restaurants, setRestaurants] = useState<[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getRestaurants();
    getMenuCategories();
  }, []);

  const addFoodItem: SubmitHandler<Inputs> = async (addFoodItem) => {
    try {
      console.log(addFoodItem);
      const response = await axiosFetch.post("api/v1/food-items", addFoodItem);
      if (response.data.data.success) {
        router.push("food-item-list");
        toast.success(response.data.message);
      } else if (!response.data.data.success) {
        if (response.data.statusCode == 500) {
          toast.error(messages.error.badResponse);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  const getMenuCategories = async () => {
    try {
      const response = await axiosFetch.get(
        "api/v1/food-items/menu-categories"
      );
      if (response.data.success) {
        setMenuCategories(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRestaurants = async () => {
    try {
      const response = await axiosFetch.get(
        "api/v1/restaurants?page=&limit=&search=&sortBy=&sortOrder="
      );
      if (response.data.success) {
        setRestaurants(response.data.result);
      }
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
                <option
                  selected
                  key={item.id}
                  className="text-gray-900"
                  value={item.id}>
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
                  selected
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
