import React from 'react';
import { Button, Form, Input, Row, Col, notification } from 'antd';
import './Login.less';
import LoginBackground from './components/LoginBackground';
import { useLoginMutation } from './hook';
import { useAppContext } from '../../context/appContext';
import { useNavigate, Link } from 'react-router-dom';
import { authMessage } from '../../constants/common';
import routerPath from '../../constants/routerPath';

const Login = () => {
  const [form] = Form.useForm();
  const { setIsAuthenticated } = useAppContext();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = (value) => {
    loginMutation.mutate(value, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        navigate('/product', { replace: true, state: '' });
        notification.success({
          message: authMessage.LOGIN_SUCCESS,
        });
      },
      onError: (error) => {
        notification.error({
          message: authMessage.LOGIN_FAIL,
        });
        console.error(error);
      },
    });
  };

  return (
    <section className='login'>
      <div className='login__container'>
        <Row gutter={[8, 8]} style={{ height: '100%' }}>
          <Col span={10}>
            <LoginBackground />
          </Col>
          <Col span={14}>
            <div className='login__logo-container'>
              <img className='login__logo' src='/images/logo.jpg' alt='' />
            </div>

            <Form
              form={form}
              onFinish={handleLogin}
              className='login__form'
              autoComplete='off'
              layout='vertical'
            >
              <Form.Item
                label='Mail'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input email!',
                  },
                  {
                    type: 'email',
                    message: 'invalid email!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label='password'
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Please input password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Row>
                <Col span={8}>
                  <Link
                    style={{ display: 'inline-block', paddingBottom: '10px' }}
                    to={routerPath.REGISTER}
                  >
                    Register
                  </Link>
                </Col>
              </Row>

              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '100%', marginTop: '10px' }}
                loading={loginMutation.isPending}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Login;
