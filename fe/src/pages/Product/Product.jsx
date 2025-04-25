import React, { useState } from 'react';
import { Table, Button, Modal, notification, Row, Input, Pagination } from 'antd';
import { useGetProductQuery, useDeleteProductMutation } from './hook';
import AddEditProductModal from './components/AddEditProductModal';
import ActionBar from '@sharedComponents/ActionBar/ActionBar';
import { NavMenuTitle } from '@constants/common';
import LoadingData from '@sharedComponents/LoadingData/LoadingData';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Search } = Input;

const Product = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    name: null,
  });
  const deleteProductMutation = useDeleteProductMutation();
  const { data, refetchProductList, total, isFetching } = useGetProductQuery(params);

  const deleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);

      refetchProductList();
      setParams((prev) => ({ ...prev, page: 1 }));
      notification.success({ message: 'Delete Successfully!' });
    } catch (error) {}
  };

  const showWarning = (id) => {
    return Modal.confirm({
      type: 'warning',
      content: 'Do you want to delete this product?',
      onOk: () => deleteProduct(id),
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const columns = [
    {
      title: 'stt',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1, // Index starts from 0, add 1 to start from 1
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <Row align='middle' key={record?.id}>
            <Button
              onClick={() => {
                setOpenModal(true);
                setSelectedId(record?.id);
              }}
              style={{ marginRight: '10px' }}
            >
              <EditOutlined />
              Update
            </Button>
            <Button type='primary' onClick={() => showWarning(record?._id)} danger>
              <DeleteOutlined />
              Delete
            </Button>
          </Row>
        );
      },
    },
  ];
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams({ page: current, limit: pageSize });
  };

  const onSearch = (value) => {
    setParams((prev) => ({ ...prev, page: 1, name: value }));
  };

  return (
    <div>
      <Row justify='space-between'>
        <ActionBar
          title={NavMenuTitle.PRODUCT_MANAGEMENT.title}
          icon={NavMenuTitle.PRODUCT_MANAGEMENT.icon}
        >
          <Row justify='space-between' style={{ width: '98%' }} align='middle'>
            <Button onClick={() => setOpenModal(true)}>Create Product</Button>
            <Search
              placeholder='input search text'
              onSearch={onSearch}
              style={{
                width: 200,
              }}
            />
          </Row>
        </ActionBar>
      </Row>
      <LoadingData
        isLoading={isFetching && !openModal}
        styled={{ height: 'calc(100vh - 90px)', width: '100%' }}
      >
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            y: null,
          }}
          pagination={{ pageSize: params.limit, total, current: params.page }}
          onChange={handleTableChange}
        />
      </LoadingData>

      {openModal ? (
        <AddEditProductModal
          isModalOpen={openModal}
          setOpenModal={setOpenModal}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
          params={params}
        />
      ) : null}
    </div>
  );
};

export default Product;
