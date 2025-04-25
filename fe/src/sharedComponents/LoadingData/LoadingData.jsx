import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24
    }}
    spin
  />
);

const LoadingData = ({ isLoading, styled = { width: '100%' }, children }) => {
  const styleLoading = isLoading
    ? { display: 'flex', alignItems: 'center', justifyContent: 'center', ...styled }
    : styled;
  return <div style={{ ...styleLoading, ...styled }}>{isLoading ? <Spin indicator={antIcon} /> : children}</div>;
};

export default LoadingData;
