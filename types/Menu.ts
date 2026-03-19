export interface MenuSection {
  id: string;
  restraunt_id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}