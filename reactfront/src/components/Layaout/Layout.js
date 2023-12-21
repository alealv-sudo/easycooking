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
const { Header, Sider, Content } = Layout;

const LayoutFront = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const {
      token: { colorBgContainer },
    } = theme.useToken();

    return (
          <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}  style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
            }}>
              <MenuNav></MenuNav>
            </Sider>
            <Layout className="site-layout" style={{
              marginLeft: 200,
            }}>
              <Header className='siteLayoutBackground'>
                {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  style: {color: "#fff"},
                  onClick: () => setCollapsed(!collapsed),
                })} */}
              </Header>
              <Content style={{
                margin: '24px 16px 0',
                overflow: 'initial',
                minHeight: '100vh',
              }}>
                {props.children}
                <Outlet></Outlet>
              </Content>
            </Layout>
          </Layout>
    );
  };
  export default LayoutFront;