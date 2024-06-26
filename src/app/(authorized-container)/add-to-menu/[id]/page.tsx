"use client";

import {
  AddToMenuResponse,
  FoodItemRequestApi,
  MenuCategoriesApi,
  MenuCategoriesResponse,
  RestaurantListResponse,
  RestaurantsApi,
} from "@/swagger";
import { Restaurant } from "@prisma/client";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = "http://localhost:3000/api/v1";

type Inputs = {
  restaurantId: number;
  categoryId: number;
};

interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

const AddToMenu = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foodItemData, setFoodItemData] = useState<any>();

  useEffect(() => {
    getRestaurants();
    getMenuCategories();
  }, []);

  useEffect(() => {
    getFoodItemDetails(Number(id));
  }, []);

  const addFoodToMenu: SubmitHandler<Inputs> = async (addFoodToMenu) => {
    try {
      const foodItemsRequestApi = new FoodItemRequestApi();
      foodItemsRequestApi
        .addToMenu({
          addToMenuRequest: {
            id: Number(id),
            categoryId: addFoodToMenu.categoryId,
            restaurantId: addFoodToMenu.restaurantId,
          },
        })
        .then((response: AddToMenuResponse) => {
          console.log(response);
          if (response?.data?.success) {
            toast.success(response?.data.message);
            router.back();
          } else {
            toast.error(response?.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getFoodItemDetails = async (foodItemId: number) => {
    try {
      const foodItemRequestApi = new FoodItemRequestApi();
      const response = await foodItemRequestApi.findFoodItemById({
        id: foodItemId,
      });
      if (response.data?.details) {
        setFoodItemData(response.data.details);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMenuCategories = async () => {
    try {
      const menuCategoriesApi = new MenuCategoriesApi();
      menuCategoriesApi
        .findMenuCategoriess()
        .then((response: MenuCategoriesResponse) => {
          const menuCategories = response.data?.result as MenuCategory[];
          setMenuCategories(menuCategories);
          setValue("categoryId", menuCategories[0].id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getRestaurants = async () => {
    try {
      const restaurantsApi = new RestaurantsApi();
      restaurantsApi
        .findRestaurants({
          limit: 10,
          page: 1,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        })
        .then((response: RestaurantListResponse) => {
          const restaurants = response.data?.rows as Restaurant[];
          setRestaurants(restaurants);
          setValue("restaurantId", restaurants[0].id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (
    foodItemId: number,
    restaurantId: number,
    categoryId: number
  ) => {
    try {
      const toDelete = confirm(
        "Are you sure, you want to delete this food item from menu?"
      );
      if (toDelete) {
        const foodItemRequestApi = new FoodItemRequestApi();
        const response = await foodItemRequestApi.removeFromMenu({
          removeFromMenuRequest: {
            categoryId: categoryId,
            restaurantId: restaurantId,
            id: foodItemId,
          },
        });
        if (response.data?.success) {
          const updatedMenu = foodItemData?.menu
            .map((item: any) => {
              if (
                item.restaurant.id == restaurantId &&
                item.menuCategory.id == categoryId
              ) {
                return undefined;
              } else {
                return item;
              }
            })
            .filter((item: any) => item != undefined);
          setFoodItemData({
            ...foodItemData,
            menu: updatedMenu,
          });
          toast.success(response.data?.message);
        } else {
          toast.error(response.data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-4xl text-center text-black">Add Food Item To Menu</h1>
      <div className="flex flex-col items-center justify-start mt-56 py-2">
        <div className="w-80">
          <table className="w-full rounded-md border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-5 py-4 text-sm text-white font-bold">
                  Restaurant
                </th>
                <th className="px-5 py-4 text-sm text-white font-bold">
                  Category
                </th>
                <th className="px-5 py-4 text-sm text-white font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {foodItemData?.menu.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-200">
                  <td className="px-4 py-3">{item.restaurant.name}</td>
                  <td className="px-4 py-3">{item.menuCategory.name}</td>
                  <td className="px-4 py-3">
                    <X
                      color="red"
                      className="cursor-pointer"
                      onClick={() =>
                        removeItem(
                          foodItemData.id,
                          item.restaurant.id,
                          item.menuCategory.id
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <br />
        <form onSubmit={handleSubmit(addFoodToMenu)}>
          <label className="text-black" htmlFor="restaurant">
            Restaurant*
          </label>
          <hr />
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
            id="restaurant"
            {...register("restaurantId", { required: true })}>
            <option disabled>-- Select Restaurant --</option>
            {restaurants.map((item: any, index) => {
              return (
                <option
                  selected
                  key={item.id}
                  className="text-gray-900"
                  value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors.categoryId && (
            <div className="error text-red-500">Please select restaurant</div>
          )}
          <hr />
          <label className="text-black" htmlFor="menu-category">
            Menu Category*
          </label>
          <hr />
          <select
            className="w-full cursor-pointer p-2 font-medium leading-6 text-black"
            id="menu-category"
            {...register("categoryId", { required: true })}>
            <option disabled>-- Select Category --</option>
            {menuCategories.map((item, index) => {
              return (
                <option
                  selected
                  key={item.slug}
                  className="text-gray-900"
                  value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors.categoryId && (
            <div className="error text-red-500">Please select category</div>
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

export default AddToMenu;
