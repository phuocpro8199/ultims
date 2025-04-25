import { Divider } from 'antd';
import React from 'react';

const AppBarDivider = ({ style, ...rest }) => {
  return (
    <Divider
      type='vertical'
      {...rest}
      style={{ height: '25px', background: 'rgb(172 172 172)', width: '1px', margin: '0px', ...style }}
    />
  );
};

export default AppBarDivider;
