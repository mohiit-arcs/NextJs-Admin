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
    <div className="bg-white min-h-screen">
      <div className="bg-white max-w-2xl text-center m-auto shadow-lg">
        <div className="px-4 py-5">
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            Restaurant Details
          </h3>
        </div>
        <div className="border-t-2 border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {restaurantData?.name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5">
              <dt className="text-sm font-medium text-gray-500">Image</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <img
                  className="m-auto"
                  src={`${baseUrl}/assets/images/restaurants/thumbnail/${restaurantData?.image}`}
                  alt=""
                />
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {restaurantData?.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">
                Phone Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {restaurantData?.phoneNumber}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">Street</dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {restaurantData?.street}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">Zipcode</dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {restaurantData?.zipcode}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {restaurantData?.city}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">State</dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {restaurantData?.state}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900 ">
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
