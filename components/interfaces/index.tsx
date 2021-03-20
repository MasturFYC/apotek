export const METHOD_POST: string = 'POST';
export const METHOD_PUT: string = 'PUT';
export const METHOD_DELETE: string = 'DELETE';
export const METHOD_GET: string = 'GET';

export interface iCategory {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  products: iProduct[]
}

export interface iWarehouse {
  id: number;
  name: string;
  location?: string;
  created_at?: Date;
  updated_at?: Date;
  products: iProduct[]
}

export interface iPeople {
  id: number;
  name: string;
  street: string;
  city: string;
  phone: string;
  cell?: string;
  zip?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface iOrder {
  id: number;
  customer_id: number;
  sales_id: number;
  due_date: Date;
  total: number;
  cash: number;
  payments: number;
  remain_payments: number;
  created_at?: Date;
  updated_at?: Date;
  sales?: iSales
}

export interface iSales extends iPeople {
  orders?: iOrder[];
}

export interface iSupplier extends iPeople {
  contact_name: string,
  products: iProduct[]
}

export interface iProduct {
  id: number;
  code: string;
  name: string;
  spec?: string;
  base_unit: string;
  base_price: number;
  base_weight: number;
  is_active: boolean;
  first_stock: number;
  unit_in_stock: number;
  category_id: number;
  supplier_id: number;
  warehouse_id: number;
  created_at?: Date;
  updated_at?: Date;
  category?: iCategory;
  units?: iUnit[]
}

export interface iUnit {
  id: number;
  barcode: string;
  name: string;
  content: number;
  weight: number;
  buy_price: number;
  margin: number;
  agent_margin: number;
  member_margin: number;
  sale_price: number;
  agent_price: number;
  member_price: number;
  profit: number;
  product_id: number;
  created_at?: Date;
  updated_at?: Date;
  product?: iProduct
}

export interface iRayon {
  id: number;
  name: string;
  descriptions?: string;
  created_at: Date;
  updated_at: Date;
  customers?: iCustomer[]
}

export interface iCustomer extends iPeople {
  rayon_id: number;
  credit_limit: number;
  descriptions?: string;
  rayon?: iRayon
}
