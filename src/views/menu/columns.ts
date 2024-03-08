import { h } from "vue";
import { NTag } from "naive-ui";
import { BasicColumn } from "@/components/Table";
export interface ListData {
  Id: number;
  StoreId: number;
  ItemName: string;
  ItemSizes: Array;
  ItemCustoms: Array;
  ItemAdds: Array;
}
export const columns: BasicColumn<ListData>[] = [
  {
    title: "Id",
    key: "Id",
    width: 50,
  },
  {
    title: "StoreId",
    key: "StoreId",
    width: 80,
  },
  {
    title: "ItemName",
    key: "ItemName",
    width: 100,
  },
  {
    title: "ItemSizes",
    key: "ItemSizes",
    width: 200,
    render(row) {
      // console.log("🚀 ~ row:", row);
      const tags = row.ItemSizes.map((targetKey) => {
        // console.log("🚀 ~ targetKey:", targetKey);
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
            },
            type: "success",
          },
          {
            default: () => {
              // console.log(targetKey);
              return `${targetKey.SizeName}/ NT$ ${targetKey.SizePrice}`;
            },
          }
        );
      });
      return tags;
    },
  },
  // {
  //   title: "ItemCustoms",
  //   key: "ItemCustoms",

  //   render(row) {
  //     // console.log("🚀 ~ row:", row);
  //     const tags = row.ItemCustoms.map((targetKey) => {
  //       // console.log("🚀 ~ targetKey:", targetKey);
  //       return h(
  //         NTag,
  //         {
  //           style: {
  //             marginRight: "6px",
  //           },
  //           type: "success",
  //         },
  //         {
  //           default: () => {
  //             // console.log(targetKey);
  //             return `${targetKey.OptionItems}`;
  //           },
  //         }
  //       );
  //     });
  //     return tags;
  //   },
  // },
  {
    title: "ItemAdds",
    key: "ItemAdds",
    width: 200,
    render(row) {
      // console.log("🚀 ~ row:", row);
      const tags = row.ItemAdds.map((targetKey) => {
        // console.log("🚀 ~ targetKey:", targetKey);
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
            },
            type: "success",
          },
          {
            default: () => {
              // console.log(targetKey);
              return `${targetKey.OptionItem} NT$ ${targetKey.OptionPrice}`;
            },
          }
        );
      });
      return tags;
    },
  },
];
