"use client";

import { messages } from "@/messages/frontend/index.message";
import {
  RestaurantListResponse,
  RestaurantsApi,
  TaxFeeApi,
  TaxFeeRequestApi,
  UpdateMenuCategoryResponse,
} from "@/swagger";
import { Restaurant } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  tax_name: string;
  tax_type: string;
  value: number;
};

const TaxTypes = [
  { name: "Flat", value: "flat" },
  { name: "Percent", value: "percent" },
];

const UpdateTaxFee = () => {
  const { id } = useParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    getTaxFeeDetails(Number(id));
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
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getTaxFeeDetails = async (taxFeeId: number) => {
    try {
      const taxFeeRequestApi = new TaxFeeRequestApi();
      const response = await taxFeeRequestApi.findTaxFeeById({
        id: taxFeeId,
      });

      if (response.data) {
        const restaurantData = response.data.details;
        setValue("tax_name", restaurantData?.taxName!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("tax_type", restaurantData?.taxType!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("value", restaurantData?.value!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaxFee: SubmitHandler<Inputs> = async (updateTaxFee) => {
    try {
      const taxFeeApi = new TaxFeeApi();
      taxFeeApi
        .updateTaxFee({
          updateTaxFeeRequest: {
            id: Number(id),
            taxName: updateTaxFee.tax_name,
            taxType: updateTaxFee.tax_type,
            value: updateTaxFee.value,
          },
        })
        .then((response: UpdateMenuCategoryResponse) => {
          console.log(response);
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
      <h1 className="text-4xl text-center text-black">Update Tax and Fee</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(updateTaxFee)}>
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

export default UpdateTaxFee;
