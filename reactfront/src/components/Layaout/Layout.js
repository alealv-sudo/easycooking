import React, { useState } from 'react';
//layout Component  
import { Layout, Menu, theme } from 'antd';
import MenuNav from '../MenuNav/MenuNav';
import './Layout.css'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { Footer } from 'antd/es/layout/layout';
const { Header, Sider, Content } = Layout;

const LayoutFront = (props) => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>

      <Layout>
        <Header className='siteHeader' color={colorBgContainer}>
          <h1>Recetas</h1>
        </Header>
        <Content style={{
          margin: "10dvh 0",
          overflow: "hidden",
          height: '80dvh',
        }}>
          <Content style={{
            overflowY: "auto",
            height: '100%',
          }}>
            <Outlet />
          </Content>
        </Content>
        <Footer className='siteFooter' color={colorBgContainer}>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutFront;