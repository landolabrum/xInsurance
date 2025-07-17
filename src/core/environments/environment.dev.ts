// environment.production.ts
import { IEnvironment, Merchant } from "./environment.interface";
import merchants, {deploy} from "~/merchants.config";
import { MerchantsConfig } from "./environment.interface";

// const serverUrl = "https://tiktok.soy";
const serverUrl:string = String(process.env.NEXT_PUBLIC_DEVELOPEMENT_SERVER?.trim())
;
const merchant: Merchant = (merchants as MerchantsConfig).merchants[deploy];

const devEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: true,
  merchant: {
    ...merchant,
    url: 'http://localhost:3000',
  },
  legacyJwtCookie: {
    authToken: "auth-token",
    guestToken: "guest-token",
    transactionToken: "transaction-token",
  },
  serviceEndpoints: {
    membership: `${serverUrl}`,
    social: `${serverUrl}`,
    distributor: "",
    shopping: `${serverUrl}`,
    home: `${serverUrl}`,
    admin: `${serverUrl}`,
    gpt: `${serverUrl}`,
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  }

};

export default devEnvironment; 