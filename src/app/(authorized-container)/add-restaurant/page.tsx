"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import axiosFetch from "@/app/axios.interceptor";
import { messages } from "@/messages/frontend/index.message";

type Inputs = {
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  image: string;
};

const AddRestaurant = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  useEffect(() => {}, []);

  const addRestaurant: SubmitHandler<Inputs> = async (addRestaurant) => {
    try {
      if (!image) {
        setImageError(true);
        return;
      }
      console.log(image);
      const compressedImage = await compressImage(image);
      const imageBase64 = await fileToBase64(image);
      const compressedImageBase64 = await fileToBase64(compressedImage);
      const imageData = {
        imageName: createUniqueFileName(),
        fullImage: imageBase64,
        thumbnailImage: compressedImageBase64,
        imageMimetype: image.type,
      };
      const addRestaurantPayload = {
        name: addRestaurant.name,
        email: addRestaurant.email,
        imageData,
        phoneNumber: addRestaurant.phoneNumber,
        street: addRestaurant.street,
        city: addRestaurant.city,
        zipCode: addRestaurant.zipCode,
        state: addRestaurant.state,
        country: addRestaurant.country,
      };

      const response = await axiosFetch.post(
        "api/v1/restaurants",
        addRestaurantPayload
      );

      if (response.data.data.success) {
        router.push("restaurant-list");
        toast.success(response.data.message);
      } else {
        if (response.data.statusCode == 500) {
          toast.error(messages.error.badResponse);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const compressImage = async (imageFile: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 200,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64."));
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      console.log(imageFile);
      const fileExtension = imageFile.name.split(".").pop();
      if (fileExtension !== "jpg" && fileExtension !== "png") {
        toast.error(messages.error.wrongFileType);
        return;
      }
      setImage(imageFile);
      setImageError(() => false);
      const base64 = await fileToBase64(imageFile);
      setPreviewImageUrl(base64);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  const createUniqueFileName = (): string => {
    const timestamp = new Date().toISOString().replace(/[-T:Z.]/g, "");
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueFilename = `${timestamp}_${randomString}`;
    return uniqueFilename;
  };

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Add Restuarant</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(addRestaurant)}>
          <label className="text-black" htmlFor="name">
            Name*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="name"
              autoComplete="off"
              placeholder="Name"
              {...register("name", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.name && (
            <div className="error text-red-500">
              {messages.form.validation.name.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="email">
            Email*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="email"
              autoComplete="off"
              placeholder="Email"
              {...register("email", {
                required: true,
                pattern: {
                  value:
                    /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/,
                  message: messages.form.validation.email.invalid,
                },
              })}
            />
          </div>
          {errors.email && (
            <div className="error text-red-500">
              {errors.email.type === "required" &&
                messages.form.validation.email.required}
              {errors.email.type === "pattern" &&
                messages.form.validation.email.invalid}
            </div>
          )}
          <label className="text-black" htmlFor="image">
            Image*
          </label>
          <div className="flex justify-between items-center">
            <input
              className="w-72 p-3 text-black"
              type="file"
              accept="image/jpeg, image/png"
              id="image"
              onChange={handleImageChange}
            />
            {previewImageUrl.trim() !== "" ? (
              <div>
                <img
                  className="h-12 object-cover"
                  src={`data:image/png;base64,${previewImageUrl}`}
                  alt=""
                />
              </div>
            ) : null}
          </div>
          {imageError && (
            <div className="error text-red-500">
              {messages.form.validation.image.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="phoneNumber">
            Phone Number*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="phoneNumber"
              autoComplete="off"
              placeholder="Phone Number"
              {...register("phoneNumber", {
                required: true,
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: messages.form.validation.phoneNumber.invalid,
                },
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.phoneNumber && (
            <div className="error text-red-500">
              {errors.phoneNumber.type === "required" &&
                messages.form.validation.phoneNumber.required}
              {errors.phoneNumber.type === "pattern" &&
                messages.form.validation.phoneNumber.invalid}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="street">
            Street*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="street"
              autoComplete="off"
              placeholder="Street"
              {...register("street", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.street && (
            <div className="error text-red-500">
              {messages.form.validation.street.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="city">
            City*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="city"
              autoComplete="off"
              placeholder="City"
              {...register("city", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.city && (
            <div className="error text-red-500">
              {messages.form.validation.city.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="zipcode">
            ZipCode*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="number"
              id="zipcode"
              autoComplete="off"
              placeholder="ZipCode"
              {...register("zipCode", {
                required: true,
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: messages.form.validation.zipCode.invalid,
                },
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.zipCode && (
            <div className="error text-red-500">
              {errors.zipCode.type === "required" &&
                messages.form.validation.zipCode.required}
              {errors.zipCode.type === "pattern" &&
                messages.form.validation.zipCode.invalid}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="state">
            State*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="state"
              autoComplete="off"
              placeholder="State"
              {...register("state", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.state && (
            <div className="error text-red-500">
              {messages.form.validation.state.required}
            </div>
          )}
          <hr />
          <label className="text-black" htmlFor="country">
            Country*
          </label>
          <div className="flex justify-center items-center">
            <input
              className="w-72 p-3 text-black"
              type="text"
              id="country"
              autoComplete="off"
              placeholder="Country"
              {...register("country", {
                required: true,
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.country && (
            <div className="error text-red-500">
              {messages.form.validation.country.required}
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

export default AddRestaurant;
