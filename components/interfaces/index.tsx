export interface iCategory {
  id: number,
  name: string,
  products: iProduct[]
}

export interface iProduct {
  id: number,
  code: string,
  name: string,
  spec: string,
  base_unit: string,
  base_price: number,
  base_weight: number,
  is_active: boolean,
  first_stock: number,
  unit_in_stock: number,
  category_id: number,
  supplier_id: number,
  warehouse_id: number,
  created_at?: Date,
  updated_at?: Date,
  category?: iCategory,
  units?: iUnit[]
}

export interface iUnit {
  id: number,
  barcode: string,
  name: string,
  content: number,
  weight: number,
  buy_price: number,
  margin: number,
  agent_margin: number,
  member_margin: number,
  sale_price: number,
  agent_price: number,
  member_price: number,
  profit: number,
  product_id: number,
  created_at?: Date,
  updated_at?: Date,
  product?: iProduct
}
