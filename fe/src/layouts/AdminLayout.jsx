import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminMenuNavigation from '@sharedComponents/AdminMenuNavigation/AdminMenuNavigation';
import './AdminLayout.less';
const AdminLayout = () => {
  return (
    <div className='admin__layout'>
      <div className='admin__body'>
        <div className='admin__side-left'>
          <AdminMenuNavigation />
        </div>
        <div className='admin__side-right'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
