import * as dotenv from "dotenv";
import * as tsconfigPaths from "tsconfig-paths";
import * as path from "path";
import * as fs from "fs-extra";

dotenv.config();
const baseUrl = path.join(__dirname, "../..");
const tsconfigFile = path.join(baseUrl, "./src/console/tsconfig.json");
const { paths } = require(tsconfigFile).compilerOptions;

tsconfigPaths.register({
  baseUrl,
  paths,
});

import { getApiDocs } from "@/config/swagger.config";

const specs = getApiDocs();

const swaggerFilePath = path.join(__dirname, "swagger.json");

fs.writeJSONSync(swaggerFilePath, specs, { spaces: 2 });
