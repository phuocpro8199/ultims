export const getProductInfoById = (data, id) => {
  return data.find((item) => item._id === id);
};
