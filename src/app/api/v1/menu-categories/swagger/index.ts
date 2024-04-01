import _ from "lodash";
import { publicResponses } from "../../swagger";
import { MenuCategoriesListRequest } from "./schemas";

export * from "./schemas";
const successListResponse = {
  description: "Success: Menu Category list success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/MenuCategoryListResponse",
      },
    },
  },
};

const successUpdateResponse = {
  description: "Success: Menu Category update success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/UpdateMenuCategoryResponse",
      },
    },
  },
};

const successCreateResponse = {
  description: "Success: Menu Category created success response",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/CreateMenuCategoryResponse",
      },
    },
  },
};

let publicListResponses, publicUpdateResponses, publicCreateResponses;
publicListResponses =
  publicUpdateResponses =
  publicCreateResponses =
    publicResponses;
publicListResponses["200"] = _.cloneDeep(successListResponse);
publicListResponses = _.cloneDeep(publicListResponses);

publicCreateResponses["200"] = successCreateResponse;
publicCreateResponses = _.cloneDeep(publicCreateResponses);

publicUpdateResponses["200"] = successUpdateResponse;
publicUpdateResponses = _.cloneDeep(publicUpdateResponses);

export const MenuCategoryAPI = {
  get: {
    "x-controller-name": "MenuCategory",
    "x-operation-name": "find",
    tags: ["MenuCategory"],
    description: "This api is for finding menu categories.",
    summary: "Endpoint for menu categories",
    responses: publicListResponses,
    parameters: MenuCategoriesListRequest,
    operationId: "findMenuCategories",
  },
  post: {
    "x-controller-name": "MenuCategory",
    "x-operation-name": "create",
    tags: ["MenuCategory"],
    description: "This api is to create the Menu Category.",
    summary: "Endpoint for creating the Menu Category",
    responses: publicCreateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateMenuCategoryRequest",
          },
        },
      },
    },
    operationId: "createMenuCategory",
  },
  patch: {
    "x-controller-name": "MenuCategory",
    "x-operation-name": "update",
    tags: ["MenuCategory"],
    description: "This api is to update the Menu Category.",
    summary: "Endpoint for updating the Menu Category",
    responses: publicUpdateResponses,
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateMenuCategoryRequest",
          },
        },
      },
    },
    operationId: "updateMenuCategory",
  },
};
