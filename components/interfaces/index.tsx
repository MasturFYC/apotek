export const METHOD_POST: string = 'POST';
export const METHOD_PUT: string = 'PUT';
export const METHOD_DELETE: string = 'DELETE';
export const METHOD_GET: string = 'GET';

export interface iCategory {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  products?: iProduct[];
}

export interface iWarehouse {
  id: number;
  name: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
  products?: iProduct[];
}

export interface iPeople {
  id: number;
  name: string;
  street: string;
  city: string;
  phone: string;
  cell?: string;
  zip?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface iOrder {
  id: number;
  customerId: number;
  salesId: number;
  dueDate: Date;
  total: number;
  cash: number;
  payments: number;
  remainPayment: number;
  createdAt?: Date;
  updatedAt?: Date;
  salesman?: iSalesman;
  customer?: iCustomer;
}

export interface iSalesman extends iPeople {
  orders?: iOrder[];
}

export interface iSupplier extends iPeople {
  contactName: string;
  products?: iProduct[];
}

export interface iProduct {
  id: number;
  code: string;
  name: string;
  spec?: string;
  baseUnit: string;
  basePrice: number;
  baseWeight: number;
  isActive: boolean;
  firstStock: number;
  unitInStock: number;
  categoryId: number;
  supplierId: number;
  warehouseId: number;
  createdAt?: Date;
  updatedAt?: Date;
  category?: iCategory;
  supplier?: iSupplier;
  warehouse?: iWarehouse;
  units?: iUnit[];
}

export interface iUnit {
  id: number;
  barcode: string;
  name: string;
  content: number;
  weight: number;
  buyPrice: number;
  margin: number;
  agentMargin: number;
  memberMargin: number;
  salePrice: number;
  agentPrice: number;
  memberPrice: number;
  profit: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
  product?: iProduct
}

export interface iRayon {
  id: number;
  name: string;
  descriptions?: string;
  createdAt?: Date;
  updatedAt?: Date;
  customers?: iCustomer[]
}

export interface iCustomer extends iPeople {
  rayonId: number;
  creditLimit: number;
  customerType: number;
  descriptions?: string;
  rayon?: iRayon
}


export interface iOrderDetail {
  id: number;
  orderId: number;
  productId: number;
  unitId: number;
  qty: number;
  realQty: number;
  barcode: string;
  productName: string;
  spec: string;
  unitName: string;
  price: number;
  disc: number;
  subtotal: number;
  order?: iOrder;
  product?: iProduct;
  unit?: iUnit;
}

export type CustomerType = {
  value: number;
  label: string;
}
export const customerTypes: CustomerType[] = [
  {value: 0, label: 'Pilih tipe...'},
  {value: 3, label: 'Agent'},
  {value: 2, label: 'Member'},
  {value: 1, label: 'Umum'},
]
