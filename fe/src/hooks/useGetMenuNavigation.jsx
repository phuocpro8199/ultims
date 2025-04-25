import { NavLink } from 'react-router-dom';
import routerPath from '../constants/routerPath';
import { NavMenuTitle } from '../constants/common';
const useGetMenuNavigation = () => {
  const defaultNavItems = [];

  const navItems = [
    {
      label: <NavLink to={routerPath.PRODUCT}>{NavMenuTitle.PRODUCT_MANAGEMENT.title}</NavLink>,
      key: NavMenuTitle.PRODUCT_MANAGEMENT.key,
      icon: NavMenuTitle.PRODUCT_MANAGEMENT.icon,
      permission: null,
    },
  ];
  const getNavMenuByPermission = () => {
    return navItems.concat(defaultNavItems);
  };

  const navFilter = getNavMenuByPermission();

  return navFilter;
};

export default useGetMenuNavigation;
