import { Form, Input, Modal, notification } from 'antd';
import React, { useEffect } from 'react';
import {
  useCreateProductMutation,
  useEditProductMutation,
  useGetProductDetailQuery,
  useGetProductQuery,
} from '../hook';
import LoadingData from '@sharedComponents/LoadingData/LoadingData';
import { InputNumber } from 'antd';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const AddEditProductModal = ({ isModalOpen, setOpenModal, setSelectedId, selectedId, params }) => {
  const createProductMutation = useCreateProductMutation();
  const editProductMutation = useEditProductMutation(selectedId);
  const { data, isFetching } = useGetProductDetailQuery(selectedId);

  const { refetchProductList } = useGetProductQuery(params);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      const { name, description, price } = data || {};
      form.setFieldsValue({ name, description, price });
    }
  }, [selectedId, JSON.stringify(data)]);

  const handleOk = () => {
    form.validateFields().then((value) => {
      if (selectedId) {
        editProductMutation.mutate(
          { ...value },
          {
            onSuccess: () => {
              notification.success({ message: 'Update Success!' });
              refetchProductList();
              setOpenModal(false);
              setSelectedId(null);
            },
            onError: (err) => {
              console.error(err);
              notification.error({ message: 'Update Failed!' });
            },
          }
        );
        return;
      }
      createProductMutation.mutate(
        { ...value },
        {
          onSuccess: () => {
            notification.success({ message: 'Add Success' });
            refetchProductList();
            setOpenModal(false);
          },
          onError: (err) => {
            console.error(err);
            notification.error({ message: 'Add Failed!' });
          },
        }
      );
    });
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedId(null);
  };
  return (
    <Modal
      title={selectedId ? 'Update Product' : 'CreateProduct'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText='Accept'
      cancelText='Deny'
      okButtonProps={{ loading: createProductMutation.isPending || editProductMutation.isPending }}
    >
      <LoadingData styled={{ height: '216px', width: '100%' }} isLoading={isFetching}>
        <Form form={form} {...layout}>
          <Form.Item
            label='name'
            name='name'
            rules={[
              {
                required: true,
                message: 'input name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='description'
            name='description'
            rules={[
              {
                required: false,
                message: 'Please input description!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Price'
            name='price'
            rules={[
              {
                required: true,
                message: 'Please input price!',
              },
              {
                type: 'number',
                min: 0,
                message: 'Price must be greater than 0',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </LoadingData>
    </Modal>
  );
};

export default AddEditProductModal;
