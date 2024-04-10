"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import { messages } from "@/messages/frontend/index.message";
import { CreateRestaurantResponse, RestaurantsApi } from "@/swagger";

type Inputs = {
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  zipcode: string;
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
        zipcode: addRestaurant.zipcode,
        state: addRestaurant.state,
        country: addRestaurant.country,
      };

      const restaurantsApi = new RestaurantsApi();
      restaurantsApi
        .createRestaurant({
          createRestaurantRequest: addRestaurantPayload,
        })
        .then((response: CreateRestaurantResponse) => {
          if (response.data?.success) {
            router.push("restaurant-list");
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        });
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
    <div className="bg-[#FFFFFF] p-5 min-h-screen px-5">
      <div className="border px-4 pt-8 rounded-xl shadow-lg bg-[#dfe2e7]">
        <div className="px-4">
          <h1 className="text-4xl text-left text-black font-extrabold px-4">
            Add Restuarant
          </h1>
        </div>

        <div className="py-8 px-4">
          <form onSubmit={handleSubmit(addRestaurant)}>
            <div className="flex gap-[6%] flex-row w-full ">
              <div className="flex flex-col w-[47%]">
                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="name">
                      Name:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
                    type="text"
                    id="name"
                    autoComplete="off"
                    placeholder="Name"
                    {...register("name", {
                      required: true,
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.name && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.name.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="email">
                      Email:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
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

                  {errors.email && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.email.type === "required" &&
                        messages.form.validation.email.required}
                      {errors.email.type === "pattern" &&
                        messages.form.validation.email.invalid}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="phoneNumber">
                      Phone Number:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
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

                  {errors.phoneNumber && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.phoneNumber.type === "required" &&
                        messages.form.validation.phoneNumber.required}
                      {errors.phoneNumber.type === "pattern" &&
                        messages.form.validation.phoneNumber.invalid}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="street">
                      Street:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
                    type="text"
                    id="street"
                    autoComplete="off"
                    placeholder="Street"
                    {...register("street", {
                      required: true,
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.street && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.street.required}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-[47%]">
                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="city">
                      City:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
                    type="text"
                    id="city"
                    autoComplete="off"
                    placeholder="City"
                    {...register("city", {
                      required: true,
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.city && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.city.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="zipcode">
                      ZipCode:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
                    type="number"
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

                  {errors.zipcode && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {errors.zipcode.type === "required" &&
                        messages.form.validation.zipCode.required}
                      {errors.zipcode.type === "pattern" &&
                        messages.form.validation.zipCode.invalid}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="state">
                      State:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
                    type="text"
                    id="state"
                    autoComplete="off"
                    placeholder="State"
                    {...register("state", {
                      required: true,
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.state && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.state.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-0 py-3 text-sm">
                    <label className="text-black" htmlFor="country">
                      Country:
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-[8px] text-sm"
                    type="text"
                    id="country"
                    autoComplete="off"
                    placeholder="Country"
                    {...register("country", {
                      required: true,
                      validate: validateNoWhiteSpace,
                    })}
                  />

                  {errors.country && (
                    <div className="error text-red-500 text-xs absolute bottom-0 px-4">
                      {messages.form.validation.country.required}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <p className="px-0 py-3 text-sm">
                <p className="text-black w-full">Image: </p>
              </p>

              <div className="bg-[#FFFFFF] p-1 mb-5 w-full text-black rounded-[8px] text-sm">
                <div className="bg-[#EBA232] hover:bg-[#cc861d] m-2 py-4 flex items-center text-center text-white rounded-[8px] w-[150px]">
                  <label className="w-full" htmlFor="image">
                    Choose file
                  </label>
                  <input
                    className="opacity-0 w-[1%]"
                    type="file"
                    accept="image/jpeg, image/png"
                    id="image"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {previewImageUrl.trim() !== "" ? (
                <div>
                  <img
                    className="h-12 object-cover absolute right-[6%] top-[48%]"
                    src={`data:image/png;base64,${previewImageUrl}`}
                    alt=""
                  />
                </div>
              ) : null}
              {imageError && (
                <div className="error text-red-500 text-xs absolute bottom-[-18px] px-4">
                  {messages.form.validation.image.required}
                </div>
              )}
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

export default AddRestaurant;
