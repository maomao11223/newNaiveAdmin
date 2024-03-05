import { BasicColumn } from "@/components/Table";
export interface ListData {
  Id: string;
  OrderOwner: string;
  OrderDate: string;
  OrderAmount: string;
}
export const columns: BasicColumn<ListData>[] = [
  {
    title: "Id",
    key: "Id",
    width: 30,
  },
  {
    title: "OrderOwner",
    key: "OrderOwner",
    width: 50,
  },
  {
    title: "OrderDate",
    key: "OrderDate",
    width: 60,
  },
  {
    title: "OrderAmount",
    key: "OrderAmount",
    width: 50,
  },
  {
    title: "OrderStatus",
    key: "OrderStatus",
    width: 100,
  },
];
