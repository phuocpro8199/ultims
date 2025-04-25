import React from 'react';
import DropdownHeader from '../Header/components/DropdownHeader/DropdownHeader';
import { Col, Row, Typography } from 'antd';
const { Text } = Typography;
import './ActionBar.less';
const ActionBar = ({ children, title, icon }) => {
  return (
    <div className='app-bar' style={{ width: '100%' }}>
      <Row>
        <Col>
          <div className='app-bar__title'>
            <Text>{icon}</Text>
            <Text>{title}</Text>
          </div>
        </Col>
        <Col span={24}>
          <Row className='app-bar__action'>
            <Col flex={1}>
              <div className='app-bar__container'>{children && children}</div>
            </Col>
            <Col style={{ marginLeft: 'auto' }}>
              <DropdownHeader />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ActionBar;
