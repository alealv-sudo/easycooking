import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, theme } from "antd";

import {
     UserOutlined,
     VideoCameraOutlined,
     PicLeftOutlined,
     UploadOutlined,
} from '@ant-design/icons';

const MenuNav = () => {

     return (
          <>
               <Menu
                    theme='dark'
                    mode="inline"
                    defaultSelectedKeys={['/']}
               >
                    <Menu.Item key="/private/blog" title="Inicio">
                         <UserOutlined />
                         <span>Inicio</span>
                         <Link to="/private/blog"></Link>
                    </Menu.Item>
                    <Menu.Item key="/private/user" title="Inicio">
                         <VideoCameraOutlined />
                         <span>User</span>
                         <Link to="/private/user"></Link>
                    </Menu.Item>
                    <Menu.Item key="/private/post" title="Publicar">
                         <PicLeftOutlined />
                         <span>Publicar</span>
                         <Link to="/private/post"></Link>
                    </Menu.Item>
                    <Menu.Item key="/private/prueba" title="Inicio">
                         <VideoCameraOutlined />
                         <span>Prueba</span>
                         <Link to="/private/prueba"></Link>
                    </Menu.Item>
                    <Menu.Item key="/private/prueba2" title="Inicio">
                         <VideoCameraOutlined />
                         <span>Prueba 2</span>
                         <Link to="/private/prueba2"></Link>
                    </Menu.Item>
                    <Menu.Item key="/private/postShowRecipe" title="Inicio">
                         <VideoCameraOutlined />
                         <span>ShowPost</span>
                         <Link to="/private/postShowRecipe"></Link>
                    </Menu.Item>
                    <Menu.Item key="/private/logout" title="upload">
                          <VideoCameraOutlined/>
                          <span>UPLOADTEST</span>
                          <Link to="/private/uploadTest"></Link>         
                    </Menu.Item>
                    <Menu.Item key="/private/logout" title="Logout">
                         <VideoCameraOutlined />
                         <span>Logout</span>
                         <Link to="/private/logout"></Link>
                    </Menu.Item>
               </Menu>
          </>
     )

}


export default MenuNav;