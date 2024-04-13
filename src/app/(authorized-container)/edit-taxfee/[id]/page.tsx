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
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">


        <div className="">
          <h1 className="md:text-4xl text-3xl mb-4 text-left text-black font-extrabold">
            Update Tax and Fee
          </h1>
        </div>



      <div className="border rounded-xl shadow-lg bg-[#FFFFFF]">

      <div className="p-8">

        <form onSubmit={handleSubmit(updateTaxFee)}>

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
                Type:
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

export default UpdateTaxFee;
