import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Typography } from 'antd';
import routerPath from '@constants/routerPath';
import './Header.less';
import DropdownHeader from './components/DropdownHeader/DropdownHeader';
import { useAppContext } from '@context/appContext';

const { Text } = Typography;

const Header = () => {
  const { isAuthenticated } = useAppContext();
  return (
    <header className='header'>
      <div className='header__logo'>
        <img src={`/images/logo.jpg`} alt='' />
      </div>
      <nav className='header__nav'>
        <NavLink
          to={routerPath.HOME}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              color: isActive ? 'red' : '#ffffff',
              viewTransitionName: isTransitioning ? 'slide' : '',
            };
          }}
        >
          TRANG CHỦ
        </NavLink>
      </nav>
      <div className='header__side-right'>
        {isAuthenticated ? (
          <DropdownHeader />
        ) : (
          <Link style={{ color: '#ffffff' }} to={routerPath.LOGIN}>
            Đăng Nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
