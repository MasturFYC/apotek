export const METHOD_POST: string = 'POST';
export const METHOD_PUT: string = 'PUT';
export const METHOD_DELETE: string = 'DELETE';
export const METHOD_GET: string = 'GET';

export interface iDataList {
  id: number;
  name: string;
}

export interface iCategory {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  products?: iProduct[];
}

export interface iWarehouse {
  id: number;
  name: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface iPaymentMethod {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  descriptions?: string;
  payments?: iPayment[]
}

export interface iPayment {
  id: number;
  orderId: number;
  methodId: number;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
  descriptions?: string;
  methodName?: string;
  order?: iOrder;
  paymentMethod?: iPaymentMethod;
}

export interface iOrder {
  id: number;
  customerId: number;
  salesId: number;
  dueDate: string;
  total: number;
  cash: number;
  payment: number;
  remainPayment: number;
  status: number;
  userId?: string;
  descriptions?: string;
  salesman?: iSalesman;
  customer?: iCustomer;
  details?: iOrderDetail[];
  payments?: iPayment[];
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
  product?: iProduct
}

export interface iRayon {
  id: number;
  name: string;
  descriptions?: string;
  createdAt?: string;
  updatedAt?: string;
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
  id: number;
  name: string;
}
export const customerTypes: CustomerType[] = [
  { id: 0, name: 'Pilih tipe...' },
  { id: 3, name: 'Agent' },
  { id: 2, name: 'Member' },
  { id: 1, name: 'Umum' },
]
