import React from 'react';
import { Button, Popover } from 'antd';
import './RibbonBtn.less';
const RibbonBtn = ({ note, ...rest }) => {
  return (
    <Popover content={note}>
      <Button className='ribbon-btn' {...rest}></Button>
    </Popover>
  );
};

export default RibbonBtn;
