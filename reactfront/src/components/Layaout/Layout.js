import React, { useState } from 'react';
//layout Component  
import { Divider, Layout, Menu, theme } from 'antd';
import MenuNav from '../MenuNav/MenuNav';
import './Layout.css'

import { Grid, IconButton, Input, InputBase, Paper, TextField } from '@mui/material';
import { Home as HomeIcon, ExitToApp as LogoutIcon, AddCircleOutline as CreatePostIcon, } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { Footer } from 'antd/es/layout/layout';
import { useAuthContext } from '../contexts/authContext';
const { Header, Sider, Content } = Layout;


const LayoutFront = (props) => {

  const { logout } = useAuthContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleLogout = () => {
    logout()
  };

  const handleHome = () => {
    // Navigate to home
    console.log('Home clicked');
  };
  // const onSearch = (value) => {

  //   axios.get(process.env.REACT_APP_API_URL + 'post/recipe_name/' + value,
  //   ).then((response) => {
  //     const recipeData = response.data;
  //     setRecipes(recipeData)
  //   })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  //   console.log(recipes);
  // };
  const handleCreatePost = () => {
    // Navigate to create post
    console.log('Create Post clicked');
  };
  return (
    <Layout>

      <Layout>
        <Header className='siteHeader' color={colorBgContainer}>
          <Grid container justifyContent={'space-evenly'} height={"100%"} alignContent={"center"}>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                bgcolor: 'transparent', // Background transparent
                border: '1px solid white', // White outline
                boxShadow: 'none', // Remove default shadow
                color: "white"
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'white' }} // Text color white
                placeholder="Buscar..."
                inputProps={{ 'aria-label': 'buscador' }}
              />
              <IconButton
                sx={{ p: '10px', color: 'white' }} // Icon color white
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
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
        <Footer className='siteFooter' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}>
          <Grid container justifyContent={'space-evenly'} height={"100%"} alignContent={"center"}>
            <Grid xs={3}>
              <IconButton onClick={handleLogout} color="primary">
                <LogoutIcon />
              </IconButton>
            </Grid>
            <Grid xs={3}>
              <IconButton onClick={handleCreatePost} color="primary">
                <CreatePostIcon />
              </IconButton>
            </Grid>
            <Grid xs={3}>
              <IconButton onClick={handleHome} color="primary">
                <HomeIcon />
              </IconButton>
            </Grid>

          </Grid>

        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutFront;