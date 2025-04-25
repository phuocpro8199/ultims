import React from 'react';
import { Typography } from 'antd';
const { Text } = Typography;
const TextInfo = ({ title, value }) => {
  return (
    <div>
      <Text strong>{title}: </Text>
      <Text ellipsis>{value}</Text>
    </div>
  );
};

export default TextInfo;
