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
      <div className="bg-white max-w-2xl text-center m-auto shadow-lg">
        <div className="px-4 py-5">
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            User Details
          </h3>
        </div>
        <div className="border-t-2 border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profileData?.name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {profileData?.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5  ">
              <dt className="text-sm font-medium text-gray-500">User Role</dt>
              <dd className="mt-1 text-sm text-gray-900 ">
                {profileData?.role?.name}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
