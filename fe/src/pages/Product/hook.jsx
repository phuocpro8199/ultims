import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import productApi from '@apis/product';

const getProductListKey = (params) => {
  return ['product', 'get-product-list', params];
};
const getProductDetailKey = (id) => {
  return ['product', 'get-product-detail', Number(id)];
};
export const useGetProductQuery = (params) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryFn: async () => {
      const response = await productApi.getProductList(params);
      return response;
    },
    queryKey: getProductListKey(params),
    enabled: true,
  });
  const refetchProductList = () => {
    queryClient.invalidateQueries({
      queryKey: getProductListKey(params),
    });
  };

  return {
    data: data?.data,
    total: data?.data.length ?? 0,
    isLoading,
    isFetching,
    refetchProductList,
  };
};

export const useCreateProductMutation = (...rest) => {
  const createProduct = (body) => {
    return productApi.createProduct(body);
  };
  return useMutation({
    mutationFn: (body) => createProduct(body),
    ...rest,
  });
};

export const useEditProductMutation = (id) => {
  const editProductDetail = (id, body) => {
    return productApi.editProduct(id, body);
  };
  return useMutation({
    mutationFn: (body) => editProductDetail(id, body),
  });
};

export const useDeleteProductMutation = () => {
  const deleteProduct = (id) => {
    return productApi.deleteProduct(id);
  };

  return useMutation({
    mutationFn: (id) => deleteProduct(id),
  });
};

export const useGetProductDetailQuery = (id) => {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryFn: async () => {
      const response = await productApi.getProductDetail(id);
      return response.data;
    },
    queryKey: getProductDetailKey(id),
    enabled: !!id,
  });
  const refetchProductDetail = () => {
    queryClient.invalidateQueries({
      queryKey: getProductDetailKey(id),
    });
  };
  return {
    data: data,
    isFetching,
    refetchProductDetail,
  };
};

export const useGetProductSelect = (selectedId, id) => {
  const { data: productList } = useGetProductQuery({ page: 1, limit: 99999, name: null });

  const renderSelectProduct = () => {
    const data = productList;
    return (
      <Select disabled={selectedId}>
        {data?.map((item) => {
          return (
            <Option value={item?._id} label={item?.name} key={item?._id}>
              <div className='demo-option-label-item'>
                <span>{item?.name}</span>
              </div>
            </Option>
          );
        })}
      </Select>
    );
  };
  return renderSelectProduct;
};
