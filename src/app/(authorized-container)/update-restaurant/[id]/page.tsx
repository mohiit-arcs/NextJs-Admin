"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import { messages } from "@/messages/frontend/index.message";
import {
  RestaurantRequestApi,
  RestaurantsApi,
  UpdateRestaurantResponse,
} from "@/swagger";

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
      const restaurantRequestApi = new RestaurantRequestApi();
      const response = await restaurantRequestApi.findRestaurantById({
        id: restaurantId,
      });
      if (response.data?.details) {
        const restaurantData = response.data.details;
        setValue("name", restaurantData.name!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("email", restaurantData.email!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("phoneNumber", restaurantData.phoneNumber!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("street", restaurantData.street!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("city", restaurantData.city!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("zipcode", restaurantData.zipcode!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("state", restaurantData.state!, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue("country", restaurantData.country!, {
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

      const restaurantsApi = new RestaurantsApi();
      restaurantsApi
        .updateRestaurant({
          updateRestaurantRequest: updateRestaurantPayload,
        })
        .then((response: UpdateRestaurantResponse) => {
          if (response.data?.success) {
            router.back();
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
    <div className="bg-gray-100 p-10 min-h-screen px-32">
      <div className="border px-8 pt-8 rounded-xl shadow-lg bg-[#dfe2e7]">
        <div className="px-4">
          <h1 className="text-4xl text-left text-black font-extrabold px-4">
            Update Restuarant
          </h1>
        </div>

        <div className="py-8 px-4">
          <form onSubmit={handleSubmit(updateRestaurant)}>
            <div className="flex gap-[6%] flex-row w-full ">
              <div className="flex flex-col w-[47%]">
                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="name">
                      Name*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {messages.form.validation.name.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="email">
                      Email*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {errors.email.type === "required" &&
                        messages.form.validation.email.required}
                      {errors.email.type === "pattern" &&
                        messages.form.validation.email.invalid}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="phoneNumber">
                      Phone Number*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {errors.phoneNumber.type === "required" &&
                        messages.form.validation.phoneNumber.required}
                      {errors.phoneNumber.type === "pattern" &&
                        messages.form.validation.phoneNumber.invalid}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="street">
                      Street*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {messages.form.validation.street.required}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-[47%]">
                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="city">
                      City*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {messages.form.validation.city.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="zipcode">
                      ZipCode*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {errors.zipcode.type === "required" &&
                        messages.form.validation.zipCode.required}
                      {errors.zipcode.type === "pattern" &&
                        messages.form.validation.zipCode.invalid}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="state">
                      State*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {messages.form.validation.state.required}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <p className="px-4 py-3 text-sm">
                    <label className="text-black" htmlFor="country">
                      Country*
                    </label>
                  </p>

                  <input
                    className="p-3 mb-5 w-full text-black rounded-full text-sm"
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
                    <div className="error text-red-500">
                      {messages.form.validation.country.required}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <p className="px-4 py-3 text-sm">
                <label className="text-black" htmlFor="image">
                  Image*
                </label>
              </p>

              <input
                className="p-3 mb-5 w-full text-black rounded-full text-sm"
                type="file"
                accept="image/jpeg, image/png"
                id="image"
                onChange={handleImageChange}
                hidden
              />

              <div className="bg-[#FFFFFF] p-3 mb-5 w-full text-black rounded-full text-sm">
                <button
                  type="button"
                  className="bg-[#EBA232] hover:bg-[#cc861d] m-2 py-3 text-white rounded-full w-[150px]">
                  Choose File
                </button>
              </div>

              {previewImageUrl.trim() !== "" ? (
                <div>
                  <img
                    className="h-12 object-cover absolute top-[48%] right-[7%]"
                    src={previewImageUrl}
                    alt=""
                  />
                </div>
              ) : null}

              {imageError && (
                <div className="error text-red-500">
                  {messages.form.validation.image.required}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#EBA232] hover:bg-[#cc861d] m-2 py-3 text-white rounded-full w-[150px]">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRestaurant;
