"use client";

import { messages } from "@/messages/frontend/index.message";
import { TaxFeeApi, RestaurantListResponse, RestaurantsApi } from "@/swagger";
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
      const response = await taxFeeApi.createTaxFee({
        createTaxFeeRequest: {
          taxName: addTaxFee.tax_name,
          taxType: addTaxFee.tax_type,
          value: addTaxFee.value,
          restaurantId: addTaxFee.restaurantId,
        },
      });
      if (response.data?.success) {
        router.push("taxFee-list");
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
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">
      <div className="">
        <h1 className="md:text-4xl text-3xl mb-4 text-left text-black font-extrabold">
          Add Tax and Fee
        </h1>
      </div>

      <div className="border rounded-xl shadow-lg bg-[#FFFFFF]">
        <div className="p-8">
          <form onSubmit={handleSubmit(addTaxFee)}>
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
                    placeholder="Tax Name"
                    {...register("tax_name", {
                      required: true,
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.tax_name && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.name.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Type:
                    </label>
                  </p>

                  <select
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
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
                      Value:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    type="text"
                    id="price"
                    autoComplete="off"
                    placeholder="Value"
                    {...register("value", {
                      required: true,
                      validate: (value) => value != 0,
                    })}
                  />

                  {errors.value && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.price.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="mb-3 md:text-sm text-xs">
                    <label className="text-black" htmlFor="name">
                      Restaurant:
                    </label>
                  </p>

                  <select
                    className="p-3 mb-5 w-full text-black rounded-[8px] border md:text-sm text-xs"
                    id="restaurant"
                    {...register("restaurantId", { required: true })}>
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

export default AddTaxFee;
