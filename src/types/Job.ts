export interface Job {
  id: number;
  type: "Product" | "Category";
  name: string;
  creatorName: string;
  date: string;
  operation: string;
}
