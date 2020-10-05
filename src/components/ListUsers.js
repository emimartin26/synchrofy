import React from "react";
import { List, Divider } from "antd";
import {
  CheckCircleTwoTone,
} from "@ant-design/icons";

function ListUsers({ users, title, subtitle }) {
  return (
    <>
      <Divider orientation="center">{title}</Divider>
      <List
        header={<h3>{subtitle}</h3>}
        bordered
        dataSource={users}
        renderItem={({ id, name }) => (
          <List.Item key={id}>
            <CheckCircleTwoTone twoToneColor="#52c41a" /> {name}
          </List.Item>
        )}
      />
    </>
  );
}

export default ListUsers;
