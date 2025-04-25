import http from '../utils/http';

export const URL_PRODUCT = 'products';

const productManagement = {
  getProductList(params) {
    return http.get(URL_PRODUCT, { params });
  },

  createProduct(body) {
    return http.post(URL_PRODUCT, body);
  },

  getProductDetail(id) {
    return http.get(`${URL_PRODUCT}/${id}`);
  },

  deleteProduct(id) {
    return http.delete(`${URL_PRODUCT}/${id}`);
  },

  editProduct(id, body) {
    return http.put(`${URL_PRODUCT}/${id}`, body);
  },
};

export default productManagement;
