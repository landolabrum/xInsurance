
import { encryptString } from "@webstack/helpers/Encryption";
import environment from "../../environment";
import ApiService, { ApiError } from "../ApiService";

import IAdminService, { IRemoteAccessResponse } from "./IAdminService";
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();



export default class AdminService
  extends ApiService
  implements IAdminService {
  constructor() {
    super(environment.serviceEndpoints.membership);
  }


    public async deleteProduct(productId: string, price_id?:string): Promise<any> {
    console.log("[DELETE PRODUCT]", productId, price_id);
    if (productId) {
      try {
        const customer = await this.get<any>(`/api/product/delete?id=${price_id?`${productId}&price_id=${price_id}`:productId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No PRODUCT Provided", 400, "MS.SI.02");
  };
  public async createProduct(productData: any): Promise<any> {
  if (!productData) throw new ApiError("No PRODUCT Provided", 400, "MS.SI.02");

  const {
    name,
    active,
    description,
    metadata = {},
    price = {},
    prices = [],
    imageFiles = [], // array of File
    imageFilenames = [], // array of optional filenames
    merchant_id,
  } = productData;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("active", String(active));
  formData.append("description", description || "");
  formData.append("merchant_id", merchant_id);
  formData.append("price", JSON.stringify(price));
  formData.append("prices", JSON.stringify(prices));
  formData.append("metadata", JSON.stringify(metadata));

  // 🔁 Upload files
  imageFiles.forEach((file: File) => {
    formData.append("imageFiles", file);
  });

  // ✅ Optional: Send filename overrides
  if (Array.isArray(imageFilenames) && imageFilenames.length > 0) {
    formData.append("filenames", JSON.stringify(imageFilenames));
  }

  try {
    return await this.post<FormData, any>(
      "/api/product/",
      formData
    );
  } catch (error: any) {
  const detail =
    error?.response?.data?.detail ||
    error?.detail ||
    (typeof error === 'string' ? error : 'Unexpected error');

  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Product creation failed';

  const status = error?.response?.status || 400;

  throw {
    message,
    detail,
    status,
    error: true,
  };
}

}
  public async setupRemoteAccess(): Promise<IRemoteAccessResponse> {
    try {
      const response = await this.post<any, any>(`/api/remote-access/setup`, {});
      return response;
    } catch (error: any) {
      return error;
    }
  }
  
  // THREATS
  public async listThreats(): Promise<any> {
    try {
      const threats = await this.get<any>(`/api/security/`);
      return threats;
    } catch (error: any) {
      return error;
    }
  };
  
  // ACCOUNTS
  public async getAccount(accountId: string): Promise<any> {
    try {
      const account = await this.get<any>(`/api/account?id=${accountId}`);
      return account;
    } catch (error: any) {
      return error;
    }
  };
  public async listAccounts(): Promise<any> {
    try {
      const accountsList = await this.get<any>(`/api/accounts/`);
      return accountsList;
    } catch (error: any) {
      return error;
    }
  };


  public async getCustomer(customerId: string): Promise<any> {
    if (customerId) {
      try {
        const customer = await this.get<any>(`/usage/admin/customer?id=${customerId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No Token Provided", 400, "MS.SI.02");
  };
  public async getSystemInfo(): Promise<any> {
    try {
      const systemDate = await this.get<any>(`/api/system/`);
      return systemDate;
    } catch (error: any) {
      return error;
    }
  };


  public async deleteCustomers(customerIds: string[]): Promise<any> {
    if (customerIds) {
      try {
        const customer = await this.post<any, any>(`/usage/admin/customer/delete`, {ids:customerIds});
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No Token Provided", 400, "MS.SI.02");
  };


  public async listCustomers(): Promise<any> {
    try {
      const customersList = await this.get<any>(`/usage/admin/customer/list`);
      // customersList?.data?.map((customer:any)=>
      //   console.log('[CUSTOMERS LIST]', customer?.metadata)
      //   )
      return customersList;
    } catch (error: any) {
      return error;
    }
  };

  public async updateCustomer(customer: any): Promise<any> {
    if (customer) {
      const encryptedCustomerData = encryptString(JSON.stringify(customer), ENCRYPTION_KEY);
      return await this.put<any, any>(`/usage/admin/customer`, {data:encryptedCustomerData});
    }
    if (!customer) throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
  };

  public async createCustomer(customer: any): Promise<any> {
    try{
      if (customer) {
        const encryptedCustomerData = encryptString(JSON.stringify(customer), ENCRYPTION_KEY);
        return await this.post<any, any>(`/usage/admin/customer/create`, {data:encryptedCustomerData});
      }
      if (!customer) throw new ApiError("NO MEMBER DATA PROVIDED", 400, "MS.SI.02");
    }catch(e:any){
      console.error("[ ERROR CREATING CUSTOMER ]", e)
    }
  };

  public async getPrice(priceId: string): Promise<any> {
    if (priceId) {
      try {
        const customer = await this.get<any>(`/api/price/?id=${priceId}`);
        return customer;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No PriceID Provided", 400, "MS.SI.02");
  };

  public async deletePrice(priceId: string): Promise<any> {
    if (priceId) {
      try {
        const deleted = await this.get<any>(`/api/price/delete?id=${priceId}`);
        return deleted;
      } catch (error: any) {
        return error;
      }
    } else throw new ApiError("No PRODUCT Provided", 400, "MS.SI.02");
  };






}