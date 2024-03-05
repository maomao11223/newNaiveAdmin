import { h } from 'vue';
import { NAvatar } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
export interface ListData {
  id: string;
  name: string;
  avatar: string;
  address: string;
  beginTime: string;
  endTime: string;
  date: string;
}
export const columns: BasicColumn<ListData>[] = [
  {
    title: 'Id',
    key: 'Id',
    width: 50,
  },
  {
    title: 'Name',
    key: 'Name',
    width: 50,
  },
  {
    title: 'Type',
    key: 'Type',
    width: 100,
  },
];
