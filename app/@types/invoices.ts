import { type Database } from "../@types/database";

type InvoicesEntity = Database["public"]["Tables"]["invoices"]["Row"];
type UserEntity = Database["public"]["Tables"]["users"]["Row"] | null;
type ProductEntity = Database["public"]["Tables"]["products"]["Row"] | null;
type UserInvoiceTotalEntity =
  | Database["public"]["Tables"]["user_invoice_total"]["Row"]
  | null;
type FriendsEntity = Database["public"]["Tables"]["friends"]["Row"] | null;
type UserProductEntity =
  | Database["public"]["Tables"]["user_products"]["Row"]
  | null;
type InvoiceProductEntity =
  | Database["public"]["Tables"]["invoice_products"]["Row"]
  | null;

export type Invoice =
  | (InvoicesEntity & {
      user: UserEntity;
    })
  | null;

export type Friend =
  | {
      id: string;
      friend_id: User;
      status: string;
      created_at: string;
    }
  | undefined;

export type User = UserEntity;

export type Product = ProductEntity;

export type InvoiceProduct = InvoiceProductEntity;

export type UserProduct = {
  description: string | null;
  external_id: string;
  id: string;
  unit_price: number;
  user_id: string;
  user_products: {
    user_id: any;
  }[];
} | null;

export type AddProduct = {
  external_id: string;
  user_id: string;
  unit_price: number;
  description: string;
};

export type ProductInfo = {
  quantity: number;
  amount: number;
  user_products?: any;
  description: string;
  user_id: string;
  unit_price: number;
  invoice_id?: string;
  product_id?: string;
};

export type AddUserProduct = {
  product_id: string;
  user_id: string;
} | null;

export type AddUserInvoiceTotal = {
  invoice_id: string;
  total: number;
  user_id: string;
};

export type UserInvoiceTotal =
  | {
      id: string;
      invoice_id: string;
      total: number;
      user_id: string & UserEntity;
    }[]
  | null;
