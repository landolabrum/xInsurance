import devEnvironment from "./environments/environment.dev";
import prodEnvironment from "./environments/environment.production";
import { IEnvironment } from "./environments/environment.interface";

const DEV_URL: string = ":3000"
const isDevEnv: boolean=typeof window == "object" && window?.location.href?.toLowerCase().includes(DEV_URL)
let environment : IEnvironment= isDevEnv?  devEnvironment: prodEnvironment;
environment = {
  ...environment,
  isProduction: !isDevEnv,
}

export default environment;