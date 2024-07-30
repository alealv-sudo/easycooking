import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import {
    Typography,
    Input,
    Form,
    DatePicker,
    Select,
    Modal,
    Button,
    Image,
    notification,
    Upload,
    message,
    Spin
} from 'antd';

export default function Profile() {
    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState([]);

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        getUser();
        getRecipes();
    },[]);

    function getRecipes() {
        axios.get(process.env.REACT_APP_API_URL + 'post/user/'  + cookies.id)
        .then((response) => {
            console.log("Data Recipes", response.data);
        })
        .catch((error) => {
            console.log(error)
        });
    }
    
    function getUser() {
        axios.get(process.env.REACT_APP_API_URL + 'user/'  + cookies.id)
            .then((response) => {
              console.log(response.data); 
               
            })
            .catch((error) => {
                console.log(error)
            });
    }

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    return (
        <React.Fragment>
        <div>Hola market List</div>
        </React.Fragment>
    );
}

