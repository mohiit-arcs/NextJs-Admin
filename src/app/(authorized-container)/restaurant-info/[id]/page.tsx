"use client";

import {
  RestaurantDetailsResponseDataDetails,
  RestaurantRequestApi,
} from "@/swagger";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const baseUrl = "http://localhost:3000";

const RestaurantInfo = () => {
  const { id } = useParams();
  const [restaurantData, setRestaurantData] =
    useState<RestaurantDetailsResponseDataDetails>();

  useEffect(() => {
    getRestaurantDetails(Number(id));
  }, []);

  const getRestaurantDetails = async (restaurantId: number) => {
    try {
      const restaurantRequestApi = new RestaurantRequestApi();
      const response = await restaurantRequestApi.findRestaurantById({
        id: restaurantId,
      });
      setRestaurantData(response.data?.details);
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="bg-white min-h-screen pt-12 pb-12">

      <div className="bg-white max-w-2xl text-center m-auto shadow-lg rounded-lg">

        <div className="px-4 py-5 bg-[#0F172A] rounded-tl-lg rounded-tr-lg">
          <h3 className="text-2xl leading-6 font-bold text-[#FFFFFF]">
            Restaurant Details
          </h3>
        </div>

        <div className=" px-4 py-5">
              <dd className="mt-1 text-sm text-gray-900">
                <img
                  className="m-auto"
                  src={`${baseUrl}/assets/images/restaurants/thumbnail/${restaurantData?.image}`}
                  alt=""
                />
              </dd>
            </div>

        <div className="">

          <dl className="px-20 py-4 rounded-lg">

            <div className="px-4 py-5 flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Name : </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                <p>{restaurantData?.name}</p>
              </dd>
            </div>

           

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">
                Email address : 
              </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900 ">
                <p>{restaurantData?.email}</p>
              </dd>
            </div>

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">
                Phone Number : 
              </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                <p>{restaurantData?.phoneNumber}</p>
              </dd>
            </div>

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">Street : </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                {restaurantData?.street}
              </dd>
            </div>

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">Zipcode : </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                {restaurantData?.zipcode}
              </dd>
            </div>

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">City : </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                {restaurantData?.city}
              </dd>
            </div>

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">State : </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                {restaurantData?.state}
              </dd>
            </div>

            <div className="px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">Country : </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                {restaurantData?.country}
              </dd>
            </div>
            
          </dl>
        </div>

      </div>
    </div>
  );
};

export default RestaurantInfo;
