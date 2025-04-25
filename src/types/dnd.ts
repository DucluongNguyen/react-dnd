export interface ItemType {
  id: string;
  label: string;
  component: React.ReactNode;
}

export interface ColumnType {
  id: string;
  items: ItemType[];
  title: string;
}
