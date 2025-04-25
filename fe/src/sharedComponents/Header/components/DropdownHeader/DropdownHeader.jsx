import React, { useEffect } from 'react';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Space, notification } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { clearLS } from '@utils/auth';
import { useAppContext } from '@context/appContext';
import { dropdownHeaderTitle } from '../constants';
import eventBus from '@utils/eventBus';
import { authMessage } from '@constants/common';
import { getEmailFromLS } from '@utils/auth';

const DropdownHeader = (props) => {
  const { setIsAuthenticated } = useAppContext();
  const queryClient = useQueryClient();
  const email = getEmailFromLS();

  const clearAuthAndRemoveQuery = () => {
    setIsAuthenticated(false);
    queryClient.removeQueries();
  };

  const handleLogout = () => {
    clearLS();
    clearAuthAndRemoveQuery();
    notification.success({ message: authMessage.LOGOUT_SUCCESS });
  };
  const logout = (
    <a style={{ display: 'flex', alignItems: 'center', gap: '2px 6px' }} onClick={handleLogout}>
      <LogoutOutlined />
      <span>{dropdownHeaderTitle.LOGOUT}</span>
    </a>
  );

  useEffect(() => {
    eventBus.on('logout', () => {
      clearAuthAndRemoveQuery();
    });
    return () => {
      eventBus.remove('logout');
    };
  }, []);

  const items = [
    { label: logout, key: 'logout' }, // remember to pass the key prop
  ];

  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className='headder__dropdown'>{email}</span>
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropdownHeader;
