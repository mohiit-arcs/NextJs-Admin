"use client";

import {
  LoginResponseDataProfile,
  MeApi,
  UserProfileResponse,
} from "@/swagger";
import { useEffect, useState } from "react";

const Profile = () => {
  const meApi = new MeApi();
  const [profileData, setProfileData] = useState<LoginResponseDataProfile>();

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = () => {
    try {
      meApi.profile().then((response: UserProfileResponse) => {
        if (response.data?.profile?.details?.id) {
          setProfileData(response.data?.profile.details);
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (

    <div className="bg-white min-h-screen pt-20">

      <div className="bg-white max-w-2xl text-center m-auto shadow-lg rounded-lg">
        
        <div className="px-4 py-5 bg-[#0F172A] rounded-tl-lg rounded-tr-lg">
          <h3 className="text-2xl leading-6 font-bold text-[#FFFFFF]">
            User Details
          </h3>
        </div>

        <div className="border-t-2 border-gray-200">
          <dl className="px-20 py-4 rounded-lg">

            <div className=" px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">Name :</dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900">
                <p className="">{profileData?.name}</p>
              </dd>
            </div>

            <div className=" px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500">
                <p>Email address :</p>
              </dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900 ">
                <p className="">{profileData?.email}</p>
              </dd>
            </div>

            <div className=" px-4 py-5 flex justify-between ">
              <dt className="text-sm font-medium text-gray-500"><p>User Role :</p></dt>
              <dd className="mt-1 w-1/3 text-left text-sm text-gray-900 ">
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
