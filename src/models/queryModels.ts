export interface Item {
    id: string;
    name: string;
    price: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}
  
export interface ItemPrice {
    id: string;
    price: number;
    timestamp: string;
}