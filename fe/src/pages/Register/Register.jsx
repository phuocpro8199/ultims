import React from 'react';
import { Button, Form, Input, Row, Col, notification, Typography, Flex, Card } from 'antd';
import { useRegisterMutation } from './hook';
import { useAppContext } from '@context/appContext';
import { useNavigate, Link } from 'react-router-dom';
import { authMessage } from '../../constants/common';
import routerPath from '../../constants/routerPath';

const { Text, Title } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const { setIsAuthenticated } = useAppContext();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = (value) => {
    registerMutation.mutate(value, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        navigate('/product', { replace: true, state: '' });
        notification.success({
          message: authMessage.REGISTER_SUCCESS,
        });
      },
      onError: (error) => {
        notification.error({
          message: authMessage.REGISTER_FAIL,
        });
        console.error(error);
      },
    });
  };

  return (
    <Flex className='w-full h-screen' justify='center' align='center'>
      <Card
        className='w-1/2'
        title={
          <Title level={3} style={{ margin: 0, color: '#1890ff' }} align='center'>
            Register
          </Title>
        }
        variant='borderless'
      >
        <Form form={form} onFinish={handleRegister} autoComplete='on' layout='vertical'>
          <Form.Item
            label={<Text strong>Name</Text>}
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<Text strong>Mail</Text>}
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
            label={<Text strong>Password</Text>}
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
          <Col span={8}>
            <Link to={routerPath.LOGIN}>Login</Link>
          </Col>
          <Row justify='center'>
            <Button
              type='primary'
              htmlType='submit'
              className='w-1/2 align-='
              style={{ marginTop: '10px' }}
              loading={registerMutation.isPending}
            >
              Register
            </Button>
          </Row>
        </Form>
      </Card>
    </Flex>
  );
};

export default Register;
