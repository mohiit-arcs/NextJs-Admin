"use client";

import { messages } from "@/messages/frontend/index.message";
import {
  TaxFeeApi,
  RestaurantListResponse,
  RestaurantsApi,
  CreateTaxFeeResponse,
  TaxFeeRequestApi,
} from "@/swagger";
import { Restaurant } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  tax_name: string;
  tax_type: string;
  value: number;
  restaurantId: number;
};

const TaxTypes = [
  { name: "Flat", value: "flat" },
  { name: "Percent", value: "percent" },
];

const AddTaxFee = () => {
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

  const addTaxFee: SubmitHandler<Inputs> = async (addTaxFee) => {
    try {
      const taxFeeApi = new TaxFeeApi();
      taxFeeApi
        .createTaxFee({
          createTaxFeeRequest: {
            taxName: addTaxFee.tax_name,
            taxType: addTaxFee.tax_type,
            value: addTaxFee.value,
            restaurantId: addTaxFee.restaurantId,
          },
        })
        .then((response: CreateTaxFeeResponse) => {
          if (response.data?.success) {
            router.push("taxFee-list");
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
      <h1 className="text-4xl text-center text-black">Add New Tax and Fee</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(addTaxFee)}>
          <label className="text-black" htmlFor="name">
            Name*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="name"
              autoComplete="off"
              placeholder="Tax Name"
              {...register("tax_name", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.tax_name && (
            <div className="error text-red-500">
              {messages.form.validation.name.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="name">
            Type*
          </label>
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
            id="restaurant"
            {...register("tax_type", { required: true })}>
            <option disabled>-- Select Tax Type --</option>
            {TaxTypes.map((item, index) => {
              return (
                <option
                  key={item.value}
                  className="text-gray-900"
                  value={item.value}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors.tax_type && (
            <div className="error text-red-500">
              {messages.form.validation.name.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="price">
            Value*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="price"
              autoComplete="off"
              placeholder="Value"
              {...register("value", {
                required: true,
                validate: (value) => value != 0,
              })}
            />
          </div>
          {errors.value && (
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

export default AddTaxFee;
