"use client";

import { LoginResponseDataProfile, MeApi } from "@/swagger";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const Profile = () => {
  const meApi = new MeApi();
  const [profileData, setProfileData] = useState<LoginResponseDataProfile>();

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    try {
      const response = await meApi.profile();
      if (response.data?.profile?.details?.id) {
        setProfileData(response.data?.profile.details);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="bg-white min-h-screen p-5">
      <div className="px-4 py-5 rounded-tl-lg rounded-tr-lg">
        <h3 className="text-4xl leading-6 font-bold text-[#0F172A]">
          User Details
        </h3>
      </div>

      <div className="bg-white border w-full text-center shadow-lg rounded-lg">
        <div className="">
          <dl className="px-5 py-4 rounded-lg ">
            <div className=" px-4 py-5 flex justify-start ">
              <dt className="text-sm font-medium text-gray-500">Name :</dt>
              <dd className=" w-1/3 pl-4 text-left text-sm text-gray-900">
                <p className="">{profileData?.name}</p>
              </dd>
            </div>

            <div className=" px-4 py-5 flex justify-start ">
              <dt className="text-sm font-medium text-gray-500">
                <p>Email address :</p>
              </dt>
              <dd className=" w-1/3 pl-4 text-left text-sm text-gray-900 ">
                <p className="">{profileData?.email}</p>
              </dd>
            </div>

            <div className=" px-4 py-5 flex justify-start ">
              <dt className="text-sm font-medium text-gray-500">
                <p>User Role :</p>
              </dt>
              <dd className=" pl-4 w-1/3 text-left text-sm text-gray-900 ">
                <p className="">{profileData?.role?.name}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
