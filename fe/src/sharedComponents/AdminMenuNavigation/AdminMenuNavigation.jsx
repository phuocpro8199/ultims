import React from 'react';
import { Divider, Menu } from 'antd';
import { useGetMenuNavigation } from '@hooks';
import './AdminMenuNavigation.less';
import { NavLink, useLocation } from 'react-router-dom';

const AdminMenuNavigation = () => {
  const items = useGetMenuNavigation();
  const { pathname } = useLocation();

  return (
    <div className='admin__navigation'>
      <div className='admin__navigation-top'>
        <NavLink to='/product' className='admin__back_to_home'>
          <img src={`/images/logo.jpg`} alt='' />
        </NavLink>
      </div>
      <Divider style={{ margin: '9px 0px', backgroundColor: '#344054' }} />
      <Menu
        theme='dark'
        style={{
          width: 256,
        }}
        selectedKeys={pathname}
        mode='inline'
        items={items}
      />
    </div>
  );
};

export default AdminMenuNavigation;
