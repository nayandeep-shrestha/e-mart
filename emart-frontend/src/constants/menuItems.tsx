/* eslint-disable import/no-extraneous-dependencies */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faTags,
  faGift,
  faStore,
  faUsers,
  faFile,
  faCog,
  faBook,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { MenuItemType } from '@/types';

const SidebarMenuItems: MenuItemType[] = [
  {
    key: 'orders',
    label: 'Orders',
    icon: <FontAwesomeIcon icon={faCartShopping} className="pr-3" />,
  },
  {
    key: 'products',
    label: 'Products',
    icon: <FontAwesomeIcon icon={faProductHunt} className="pr-3" />,
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: <FontAwesomeIcon icon={faTags} className="pr-3" />,
  },
  {
    key: 'offers',
    label: 'Offers',
    icon: <FontAwesomeIcon icon={faGift} className="pr-3" />,
  },
  {
    key: 'stores',
    label: 'Stores',
    icon: <FontAwesomeIcon icon={faStore} className="pr-3" />,
  },
  {
    key: 'store-users',
    label: 'Store Users',
    icon: <FontAwesomeIcon icon={faUsers} className="pr-3" />,
  },
  {
    key: 'users',
    label: 'Admin Users',
    icon: <FontAwesomeIcon icon={faUsers} className="pr-3" />,
  },
  {
    key: 'transaction-history',
    label: 'Transaction History',
    icon: <FontAwesomeIcon icon={faFile} className="pr-3" />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <FontAwesomeIcon icon={faCog} className="pr-3" />,
  },
  {
    key: 'admin-docs',
    label: 'Admin Docs',
    icon: <FontAwesomeIcon icon={faBook} className="pr-3" />,
  },
  {
    key: 'mobile-docs',
    label: 'Mobile App Docs',
    icon: <FontAwesomeIcon icon={faBook} className="pr-3" />,
  },
  {
    key: 'download',
    label: 'Download App',
    icon: <FontAwesomeIcon icon={faDownload} className="pr-3" />,
  },
];

export default SidebarMenuItems;
