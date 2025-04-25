import { Button, Form, Input, notification } from 'antd';
import React from 'react';
import { useVerifyEmail } from './hook';
import { useNavigate } from 'react-router-dom';
import routerPath from '../../constants/routerPath';
import { USER_ERRORS } from '../../constants/common';

const VerifyEmail = () => {
  const verifyEmail = useVerifyEmail();
  const navigate = useNavigate();
  const onFinish = (value) => {
    verifyEmail.mutate(value, {
      onSuccess: (value) => {
        navigate(`${routerPath.FORGOT_PASSWORD}?id=${value.data.data}`);
      },
      onError: (err) => {
        notification.error({ message: USER_ERRORS?.[err.response.data.message] });
      }
    });
  };
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(240 240 240 / 25%)'
      }}
    >
      <div
        style={{
          maxWidth: '450px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '#d9d9d9 0px 1px 1px 1px'
        }}
      >
        <Form layout='horizontal' style={{ display: 'flex', gap: '10px' }} onFinish={onFinish}>
          <Form.Item
            style={{ marginBottom: 0 }}
            name='email'
            label='Email'
            rules={[
              {
                type: 'email'
              }
            ]}
          >
            <Input style={{ width: '250px' }} placeholder='Nhập mail của bạn' />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmail;
