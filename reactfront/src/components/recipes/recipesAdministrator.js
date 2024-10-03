import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import { RollbackOutlined } from "@ant-design/icons";

import ListAdmRecipes from './listAdmRecipes'
import ListAdmGenPost from './listAdmGenPost'
import ListAdmReviews from './listAdmReviews'

import {
    Button,
    Tabs,
    Spin,
    Card,
}  from 'antd';

import '../recipeCalendar/marketList.css';

export default function RecipeCalendar() {

    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [userID, setUserID] = useState(cookies.id);

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        setLoading(false)
    },[]);


    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }
    const data = [
        {
            label: 'RECETAS',
            key: 'MYRECIPES',
            children:  <ListAdmRecipes userId={userID}/>,  
            forceRender: true,
        },
        {
            label: 'POSTS',
            key: 'POSTS',
            children:  <ListAdmGenPost userId={userID}/>,
            forceRender: true,  
        },
        {
            label: 'REVIEWS',
            key: 'REVIEWS',
            children:  <ListAdmReviews userId={userID} />, 
            forceRender: true, 
        },

    ]

    const navTo = () => {
        navigate("/private/blog");
    };

    return (
        <React.Fragment>
        <Grid
        container
        spacing={1}
        xs={12}
        justifyContent={{ xs: "center", md: "space-evenly" }}
        alignContent={"center"}
        >
        <Grid item width={"100%"} md={9}>
        <div className="bottom-page-nav">
            <div className="buttom-div-nav">
              <Button
                type="default"
                size="large"
                style={{
                  fontSize: "20px",
                  height: "50px",
                  width: "90px",
                }}
                onClick={() => navTo()}
              >
                <RollbackOutlined />
              </Button>
            </div>
          </div>
            <div className='div-general-calendar'>
            <Card className='div-tab-calendar'>
            <Tabs
                size='large'
                type="card"
                centered
                items={data}
            />
            </Card>
            </div>
            <div className="bottom-page-nav">
            <div className="buttom-div-nav">
              <Button
                type="default"
                size="large"
                style={{
                  fontSize: "20px",
                  height: "50px",
                  width: "90px",
                }}
                onClick={() => navTo()}
              >
                <RollbackOutlined />
              </Button>
            </div>
          </div>
        </Grid>
        </Grid>   
        </React.Fragment>
    );
}

