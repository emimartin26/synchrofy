import React from "react";

import { Row, Col, Input } from "antd";

const gridStyle = {
  textAlign: "center",
};

const Login = ({ handleOnKeyPress }) => {
  return (
    <Row justify="center">
      <Col span={12} style={gridStyle}>
        <Input placeholder="Input Alias" onKeyPress={handleOnKeyPress} />
      </Col>
    </Row>
  );
};

export default Login;
