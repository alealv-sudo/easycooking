import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Input,
    Button,
    Form,
    Card,
    Spin
}  from 'antd';

import './marketList.css';
import Item from 'antd/es/list/Item';

export default function Profile() {

    const { id } = useParams();
    const navigate = useNavigate(); 

    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [listData, setListData] = useState()

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        getList()
    },[]);

    function getList() {
        axios.get(process.env.REACT_APP_API_URL + 'marketList/'  + id)
        .then((response) => {
            const listResponse = response.data
            setListData(listResponse)
            setLoading(false)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    const navTo = () => {
        navigate("/private/marketlist");
    }

    return (
        <React.Fragment>       
        <div className='div-general-list'>
            <Form
            className='div-form-general-recipe-post'
            layout="vertical"
            name="dynamic_form_complex"
            autoComplete="off"
            initialValues={{
                name: listData.list_title,
                items: listData.listitems
            }}
            >
            <Card
                size='default'
                title={listData.list_title}>   
            {/* Input Ingredientes */}
                    <div type="flex" justify="center" align="middle">
                    <Form.List 
                    name="items"
                    >
                    {(fields) => (
                        <>
                        {fields.map(({ key, name, ...restField } ) => (
                            <div
                            key={key}
                            className='item-form-list-input'
                            >
                            <Form.Item
                                style={{
                                    width: '80%',
                                    marginRight: 6,
                                }}
                                {...restField}
                                name={[name, 'ingredient']}
                                rules={[
                                {
                                    required: true,
                                    message: 'Missing ingredient',
                                },
                                ]}
                            >
                                <Input disabled={true} placeholder="ingredient" />
                            </Form.Item>
                            </div>
                        ))}
                        </>  
                    )}
                    </Form.List>
                    
                    </div>
                    
            <Form.Item
                className="my-form-container"
                >
                <div className='half-width-slot-profile-btnRP'>
                    <div>
                        <Button danger type="primary" shape='default' onClick={navTo}> Salir </Button>
                    </div>
                </div>
            </Form.Item>
            </Card>       
            </Form>
        </div>
        </React.Fragment>
    );
}

