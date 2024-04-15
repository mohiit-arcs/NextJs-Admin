"use client";

import {
  RestaurantDetailsResponseDataDetails,
  RestaurantRequestApi,
} from "@/swagger";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, MapPin, Phone } from "lucide-react";
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
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white text-center m-5 shadow-lg rounded-lg">
        <div className="px-4 py-5 bg-[#0F172A] rounded-tl-lg rounded-tr-lg">
          <h3 className="text-2xl leading-6 font-bold text-[#FFFFFF]">
            Restaurant Details
          </h3>
        </div>

        <div className="">
          <dd className="mt-0 text-sm text-gray-900 ">
            <img
              className="m-0 w-full bg-cover md:h-96 h-auto"
              src={`${baseUrl}/assets/images/restaurants/${restaurantData?.image}`}
              alt=""
            />
          </dd>
        </div>

        <div className="text-left p-10">
          <div className="text-3xl font-bold text-[#0F172A] mb-4">
            <p>{restaurantData?.name}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end text-sm text-[#696969]">
            <div>
              <div className="flex mb-[12px]">
                <p>
                  <Mail height={18} />
                </p>
                <p className="pl-[10px]">{restaurantData?.email}</p>
              </div>

              <div className="flex mb-[12px]">
                <p>
                  <Phone height={18} />
                </p>
                <p className="pl-[10px]">{restaurantData?.phoneNumber}</p>
              </div>

              <div className="flex">
                <div>
                  <p>
                    <MapPin height={18} />
                  </p>
                </div>
                <div className="pl-[5px]">
                  <p className="mb-[5px]">{restaurantData?.street}</p>
                  <p className="mb-[5px]">
                    {restaurantData?.city}, {restaurantData?.zipcode}
                  </p>
                  <p>
                    {restaurantData?.state}, {restaurantData?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="px-4 py-5">
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
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
