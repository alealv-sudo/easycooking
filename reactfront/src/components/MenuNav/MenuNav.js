import React, { useState, useEffect } from 'react';
import { Link, useLocation  } from "react-router-dom";
import { Menu, theme } from "antd";

import {
    UserOutlined,
    VideoCameraOutlined,
    PicLeftOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const MenuNav = () => {

    return(
       <div>
        <div style={{height: "32px", background: "rgba(255, 255, 255, 0.2)", margin: "16px"}}></div>
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
                    <VideoCameraOutlined/>
                    <span>User</span>
                    <Link to="/private/user"></Link>         
               </Menu.Item>
               <Menu.Item key="/private/post" title="Publicar">
                    <PicLeftOutlined />
                    <span>Publicar</span>
                    <Link to="/private/post"></Link>         
               </Menu.Item>
               <Menu.Item key="/private/prueba" title="Inicio">
                    <VideoCameraOutlined/>
                    <span>Prueba</span>
                    <Link to="/private/prueba"></Link>         
               </Menu.Item>
               <Menu.Item key="/private/prueba2" title="Inicio">
                    <VideoCameraOutlined/>
                    <span>Prueba 2</span>
                    <Link to="/private/prueba2"></Link>         
               </Menu.Item>
               <Menu.Item key="/private/logout" title="Logout">
                    <VideoCameraOutlined/>
                    <span>Logout</span>
                    <Link to="/private/logout"></Link>         
               </Menu.Item>
           </Menu>  
       </div>   
    ) 
}


export default MenuNav;