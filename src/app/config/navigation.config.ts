export interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavigationItem[];
  expanded?: boolean;
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    label: 'Home',
    icon: 'home',
    route: '/'
  },
  {
    label: 'Financial',
    icon: 'account_balance',
    expanded: false,
    children: [
      {
        label: 'Categories',
        icon: 'category',
        route: '/category'
      },
      {
        label: 'Sub Categories',
        icon: 'subdirectory_arrow_right',
        route: '/subCategory'
      },
      {
        label: 'Bills',
        icon: 'receipt',
        route: '/bill'
      }
    ]
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: '/settings'
  }
];
