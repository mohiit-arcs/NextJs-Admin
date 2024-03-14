"use client";

import { useParams, useRouter } from "next/navigation";
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
  zipcode: string;
  state: string;
  country: string;
  image: FileList;
};
const apiUrl = "http://localhost:3000/api/v1/restaurants";
const baseUrl = "http://localhost:3000";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  useEffect(() => {
    getRestaurantDetails(Number(id));
  }, []);

  const getRestaurantDetails = async (restaurantId: number) => {
    try {
      const response = await axiosFetch.get(`${apiUrl}/${restaurantId}`);

      if (response.data.data?.success) {
        const restaurantData = response.data.data.details;
        setValue("name", restaurantData.name, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("email", restaurantData.email, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("phoneNumber", restaurantData.phoneNumber, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("street", restaurantData.street, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("city", restaurantData.city, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("zipcode", restaurantData.zipcode, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("state", restaurantData.state, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("country", restaurantData.country, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setPreviewImageUrl(
          `${baseUrl}/assets/images/restaurants/thumbnail/${restaurantData.image}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateRestaurant: SubmitHandler<Inputs> = async (updateRestaurant) => {
    try {
      if (!image && previewImageUrl.trim() == "") {
        console.log(previewImageUrl);
        setImageError(true);
        return;
      }
      let imageData = {};
      if (image) {
        const compressedImage = await compressImage(image);
        const imageBase64 = await fileToBase64(image);
        const compressedImageBase64 = await fileToBase64(compressedImage);
        imageData = {
          imageName: createUniqueFileName(),
          fullImage: imageBase64,
          thumbnailImage: compressedImageBase64,
          imageMimetype: image.type,
        };
      }
      const updateRestaurantPayload = {
        id: Number(id),
        name: updateRestaurant.name,
        email: updateRestaurant.email,
        imageData,
        phoneNumber: updateRestaurant.phoneNumber,
        street: updateRestaurant.street,
        city: updateRestaurant.city,
        zipcode: updateRestaurant.zipcode,
        state: updateRestaurant.state,
        country: updateRestaurant.country,
      };

      const response = await axiosFetch.patch(
        `${apiUrl}`,
        updateRestaurantPayload
      );

      if (response.data.data.success) {
        router.back();
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

  const createUniqueFileName = (): string => {
    const timestamp = new Date().toISOString().replace(/[-T:Z.]/g, "");
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueFilename = `${timestamp}_${randomString}`;
    return uniqueFilename;
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
      setPreviewImageUrl(`data:image/png;base64,${base64}`);
    }
  };

  const validateNoWhiteSpace = (value: string) => {
    return !!value.trim();
  };

  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl text-center text-black">Update Restuarant</h1>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <hr />
        <form onSubmit={handleSubmit(updateRestaurant)}>
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
                  src={previewImageUrl}
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
              id="zipcode"
              autoComplete="off"
              placeholder="ZipCode"
              {...register("zipcode", {
                required: true,
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: messages.form.validation.zipCode.invalid,
                },
                validate: validateNoWhiteSpace,
              })}
            />
          </div>
          {errors.zipcode && (
            <div className="error text-red-500">
              {errors.zipcode.type === "required" &&
                messages.form.validation.zipCode.required}
              {errors.zipcode.type === "pattern" &&
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

export default UpdateRestaurant;
