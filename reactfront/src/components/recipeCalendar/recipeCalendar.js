import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import ListDay from './listDay.js'

import {
    Tabs,
    Form,
    Table,
    Button,
    Card,
    Spin,
    Select,
    Popconfirm,
    message,
    notification,
    checkbox,
    Modal,
}  from 'antd';

import './marketList.css';
import TabPane from 'antd/es/tabs/TabPane';

export default function RecipeCalendar() {

    const navigate = useNavigate(); 

    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [userID, setUserID] = useState(cookies.id);
    const [FavoritesData, setFavoritesData] = useState([])
    const [selectData, setSelectData] = useState([])

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        getFavorites()  
    },[]);

    function getFavorites() {
        axios.get(process.env.REACT_APP_API_URL + 'favorites/alluser/'  + cookies.id)
        .then((response) => {
            const FavoritesRes = response.data
            console.log(FavoritesRes);
            
            const favData = FavoritesRes.map((e) => {
                return{
                    value: e.recipe.id,
                    label: e.recipe.recipe_name
                }
            })
            setLoading(false)
            setSelectData(favData)
            setFavoritesData(FavoritesRes)
        })
        .catch((error) => {
            console.log(error)
        });
      
    }

/* 
    function deleteList(id) {
        
        axios.delete(process.env.REACT_APP_API_URL + 'listItems/' + id)
            .then((response) => {
            
            })
            .catch((error) => {
                console.log(error)
            });
    }
 */

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

/*     const navTo = () => {
        navigate("/private/newlist");
    }

    function navToEdit(id){
        navigate("/private/editlist/" + id);
    } */

    const data = [
        {
            label: 'LUNES',
            key: 'LUNES',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"LUNES"}/>,  
        },
        {
            label: 'MARTES',
            key: 'MARTES',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"MARTES"}/>,  
        },
        {
            label: 'MIERCOLES',
            key: 'MIERCOLES',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"MIERCOLES"}/>,  
        },
        {
            label: 'JUEVES',
            key: 'JUEVES',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"JUEVES"}/>,  
        },
        {
            label: 'VIERNES',
            key: 'VIERNES',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"VIERNES"}/>,  
        },
        {
            label: 'SABADO',
            key: 'SABADO',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"SABADO"}/>,  
        },
        {
            label: 'DOMINGO',
            key: 'DOMINGO',
            children: <ListDay favSelect={selectData} favorites={FavoritesData} userId={userID} day={"DOMINGO"}/>,  
        },
    ]

    return (
        <React.Fragment>
            <div className='div-general-calendar'>
            <Tabs
                className='div-tab-calendar'
                size='large'
                type="card"
                centered
                items={data}
            />
            </div>
        </React.Fragment>
    );
}

