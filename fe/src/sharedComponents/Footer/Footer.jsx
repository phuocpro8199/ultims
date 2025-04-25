import React from 'react';
import { Row, Col, Divider, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './Footer.less';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__container'>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <RightOutlined style={{ fontSize: '10px' }} /> Cho thuê xe tải chở hàng
          </Col>
        </Row>
        <Divider style={{ background: '#ffffff' }} />
        <div className='footer__info'></div>
      </div>
    </footer>
  );
};

export default Footer;
