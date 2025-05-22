import { Preview } from "./Preview";

export interface PurchaseContextType {
  data: Preview | null;
  setData: (data: Preview) => void;
}