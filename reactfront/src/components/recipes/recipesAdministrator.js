import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Grid } from '@mui/material';

import ListAdmRecipes from './listAdmRecipes'
import ListAdmGenPost from './listAdmGenPost'
import ListAdmReviews from './listAdmReviews'

import {
    Typography,
    Tabs,
    Spin,
    Card,
}  from 'antd';

import '../recipeCalendar/marketList.css';

export default function RecipeCalendar() {

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
        },
        {
            label: 'POSTS',
            key: 'POSTS',
            children:  <ListAdmGenPost userId={userID}/>,  
        },
        {
            label: 'REVIEWS',
            key: 'REVIEWS',
            children:  <ListAdmReviews userId={userID} />,  
        },

    ]

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
        </Grid>
        </Grid>   
        </React.Fragment>
    );
}

