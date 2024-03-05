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
    title: "OrderId",
    key: "OrderId",
    width: 50,
  },
  {
    title: "UserName",
    key: "UserName",
    width: 60,
  },
  {
    title: "MenuId",
    key: "MenuId",
    width: 50,
  },
  {
    title: "SubTotal",
    key: "SubTotal",
    width: 50,
  },
  {
    title: "IsPay",
    key: "IsPay",
    width: 50,
  },
];
