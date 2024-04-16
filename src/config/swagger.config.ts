import { config } from "./index.config";
import { Options } from "swagger-jsdoc";
import { createSwaggerSpec } from "next-swagger-doc";
import {
  LoginAPI,
  LoginRequest,
  LoginResponse,
} from "@/app/api/v1/auth/login/swagger";
import {
  SignupAPI,
  SignupRequest,
  SignupResponse,
} from "@/app/api/v1/auth/signup/swagger";
import {
  UsersAPI,
  UserListResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/app/api/v1/users/swagger";
import {
  UserRolesAPI,
  UserRolesResponse,
} from "@/app/api/v1/users/roles/swagger";
import {
  UserByIdAPI,
  UserDeleteResponse,
  UserDetailsResponse,
} from "@/app/api/v1/users/[id]/swagger";
import {
  RestaurantsAPI,
  RestaurantListResponse,
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  UpdateRestaurantRequest,
  UpdateRestaurantResponse,
} from "@/app/api/v1/restaurants/swagger";
import {
  RestaurantByIdAPI,
  RestaurantDeleteResponse,
  RestaurantDetailsResponse,
} from "@/app/api/v1/restaurants/[id]/swagger";
import {
  FoodItemsAPI,
  CreateFoodItemRequest,
  CreateFoodItemResponse,
  FoodItemsListResponse,
  UpdateFoodItemRequest,
  UpdateFoodItemResponse,
} from "@/app/api/v1/food-items/swagger";
import {
  MenuCategoriesAPI,
  MenuCategoriesResponse,
} from "@/app/api/v1/food-items/menu-categories/swagger";
import {
  FoodItemByIdAPI,
  FoodItemDeleteResponse,
  FoodItemDetailsResponse,
} from "@/app/api/v1/food-items/[id]/swagger";
import {
  AddToMenuAPI,
  AddToMenuRequest,
  AddToMenuResponse,
} from "@/app/api/v1/food-items/add-to-menu/swagger";
import {
  RemoveFromMenuAPI,
  RemoveFromMenuRequest,
  RemoveFromMenuResponse,
} from "@/app/api/v1/food-items/remove-from-menu/swagger";
import {
  UserProfileAPI,
  UserProfileRequest,
  UserProfileResponse,
  UserProfileUpdateResponse,
} from "@/app/api/v1/me/swagger";
import {
  ChangePasswordAPI,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/app/api/v1/me/change-password/swagger";
import {
  MenuCategoryAPI,
  CreateMenuCategoryRequest,
  CreateMenuCategoryResponse,
  MenuCategoryListResponse,
  UpdateMenuCategoryRequest,
  UpdateMenuCategoryResponse,
} from "@/app/api/v1/menu-categories/swagger";
import {
  MenuCategoryByIdAPI,
  MenuCategoryDetailsResponse,
} from "@/app/api/v1/menu-categories/[id]/swagger";
import {
  TaxFeeAPI,
  CreateTaxFeeRequest,
  CreateTaxFeeResponse,
  TaxFeeListResponse,
  UpdateTaxFeeRequest,
  UpdateTaxFeeResponse,
} from "@/app/api/v1/tax-fee/swagger";
import {
  TaxFeeByIdAPI,
  TaxFeeDeleteResponse,
  TaxFeeDetailsResponse,
} from "@/app/api/v1/tax-fee/[id]/swagger";
import { OrdersAPI, OrdersListResponse } from "@/app/api/v1/orders/swagger";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: config.swagger.openapi,
      info: config.swagger.info,
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          LoginRequest,
          LoginResponse,
          SignupRequest,
          SignupResponse,
          UserRolesResponse,
          UserListResponse,
          UpdateUserRequest,
          UpdateUserResponse,
          UserDeleteResponse,
          UserDetailsResponse,
          RestaurantListResponse,
          CreateRestaurantRequest,
          CreateRestaurantResponse,
          UpdateRestaurantRequest,
          UpdateRestaurantResponse,
          RestaurantDeleteResponse,
          RestaurantDetailsResponse,
          MenuCategoriesResponse,
          CreateFoodItemRequest,
          CreateFoodItemResponse,
          FoodItemsListResponse,
          UpdateFoodItemRequest,
          UpdateFoodItemResponse,
          FoodItemDeleteResponse,
          FoodItemDetailsResponse,
          AddToMenuRequest,
          AddToMenuResponse,
          RemoveFromMenuRequest,
          RemoveFromMenuResponse,
          UserProfileRequest,
          UserProfileResponse,
          UserProfileUpdateResponse,
          ChangePasswordRequest,
          ChangePasswordResponse,
          CreateMenuCategoryRequest,
          CreateMenuCategoryResponse,
          MenuCategoryListResponse,
          UpdateMenuCategoryRequest,
          UpdateMenuCategoryResponse,
          MenuCategoryDetailsResponse,
          CreateTaxFeeRequest,
          CreateTaxFeeResponse,
          TaxFeeListResponse,
          UpdateTaxFeeRequest,
          UpdateTaxFeeResponse,
          TaxFeeDeleteResponse,
          TaxFeeDetailsResponse,
          OrdersListResponse,
        },
      },
      servers: [
        {
          url: config.swagger.serverUrl,
        },
      ],
      security: [],
      paths: {
        "/auth/login": LoginAPI,
        "/auth/signup": SignupAPI,
        "/users": UsersAPI,
        "/users/roles": UserRolesAPI,
        "/users/{id}": UserByIdAPI,
        "/restaurants": RestaurantsAPI,
        "/restaurants/{id}": RestaurantByIdAPI,
        "/food-items": FoodItemsAPI,
        "/food-items/menu-categories": MenuCategoriesAPI,
        "/food-items/{id}": FoodItemByIdAPI,
        "/food-items/add-to-menu": AddToMenuAPI,
        "/food-items/remove-from-menu": RemoveFromMenuAPI,
        "/me": UserProfileAPI,
        "/me/change-password": ChangePasswordAPI,
        "/menu-categories": MenuCategoryAPI,
        "/menu-categories/{id}": MenuCategoryByIdAPI,
        "/tax-fee": TaxFeeAPI,
        "/tax-fee/{id}": TaxFeeByIdAPI,
        "/orders": OrdersAPI,
      },
    },
  }) as Options;
  return spec;
};
