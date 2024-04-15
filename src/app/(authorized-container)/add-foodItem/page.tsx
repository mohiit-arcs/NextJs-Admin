"use client";

import { messages } from "@/messages/frontend/index.message";
import {
  FoodItemsApi,
  MenuCategoryApi,
  MenuCategoryListResponse,
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
  const [restaurantId, setRestaurantId] = useState<number>();
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

  useEffect(() => {
    getMenuCategories();
  }, [restaurantId]);

  const addFoodItem: SubmitHandler<Inputs> = async (addFoodItem) => {
    try {
      const foodItemApi = new FoodItemsApi();
      const response = await foodItemApi.createFoodItem({
        createFoodItemRequest: addFoodItem,
      });
      if (response.data?.success) {
        router.push("food-item-list");
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  const getMenuCategories = async () => {
    try {
      const menuCategoriesApi = new MenuCategoryApi();
      console.log(restaurantId);
      if (restaurantId)
        menuCategoriesApi
          .findMenuCategories({
            limit: 10,
            page: 1,
            search: "",
            sortBy: "createdAt",
            sortOrder: "desc",
            restaurantId: restaurantId,
          })
          .then((response: MenuCategoryListResponse) => {
            const menuCategories = response.data?.rows as MenuCategory[];
            setMenuCategories(menuCategories);
            if (menuCategories.length != 0)
              setValue("categoryId", menuCategories[0].id);
            else
              toast.warn(
                "Please create menu category first for this restaurant"
              );
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
          setRestaurantId(restaurants[0].id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestaurantChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRestaurantId = parseInt(event.target.value);
    setRestaurantId(selectedRestaurantId);
  };

  return (
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">
      <div className="">
        <h1 className="md:text-4xl text-3xl mb-4 text-left text-black font-extrabold">
          Add Restuarant
        </h1>
      </div>

      <div className="border rounded-xl shadow-lg bg-[#FFFFFF]">
        <div className="p-8">
          <form onSubmit={handleSubmit(addFoodItem)}>
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

              <div className="flex flex-col md:w-[47%] w-full">
                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Restaurant:
                    </label>
                  </p>

                  <select
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    id="restaurant"
                    {...register("restaurantId", { required: true })}
                    value={restaurantId}
                    onChange={handleRestaurantChange}>
                    <option disabled>-- Select Restaurant --</option>
                    {restaurants.map((item: any, index) => {
                      return (
                        <option
                          key={item.id}
                          className="text-gray-900"
                          value={item.id}>
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

                {restaurantId && (
                  <div className="relative">
                    <p className="mb-3 md:text-sm text-xs">
                      <label className="text-black" htmlFor="name">
                        Menu Cetagory:
                      </label>
                    </p>

                    <select
                      className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                      id="menu-category"
                      {...register("categoryId", { required: true })}>
                      <option disabled>-- Select Category --</option>
                      {menuCategories.length &&
                        menuCategories.map((item, index) => {
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
                      <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                        {messages.form.validation.menuCategory.required}
                      </div>
                    )}
                  </div>
                )}
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

export default AddFoodItem;
