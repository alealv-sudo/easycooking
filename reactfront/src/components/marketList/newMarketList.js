import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid } from '@mui/material';


import { CloseOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import {
    notification,
    Card,
    Input,
    Form,
    Button,
    Space,
    Spin
} from 'antd';

import './marketList.css';

export default function Profile() {

    const navigate = useNavigate(); 

    const [cookies, setCookie] = useCookies(['userToken']);
    const [isLoading, setLoading] = useState(true);

    const [form] = Form.useForm();

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        setLoading(false)
    },[]);

    function onFinish(values) {

        const marketList = {
            list_title: values.name,
            userId: cookies.id 
        }

        axios.post(process.env.REACT_APP_API_URL + 'marketList/', marketList)
        .then((response) => {
            const listId = response.data.id
            setItemList(listId , values.items)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    
    function setItemList(listId , items) {

        var itemList = []
        
        for (let index = 0; index < items.length; index++) {

            var newElement = {
                mListId: listId,
                ingredient: items[index].ingredientes
            } 

            itemList.push(newElement) 
        }

        axios.post(process.env.REACT_APP_API_URL + 'listItems/', itemList)
            .then((response) => {
                notification.success({
                    message: 'Lista creada con exito'
                });
                navTo() 
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const navTo = () => {
        navigate("/private/marketlist");
    }

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

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
        <div className='div-general-list'>
            <Form
            onFinish={onFinish}
            className='div-form-general-recipe-post'
            layout="vertical"
            form={form}
            name="dynamic_form_complex"
            autoComplete="off"
            >
            <Card
                size='default'
                title={'Nueva Lista'}>   
            {/* Input Ingredientes */}
                    <div type="flex" justify="center" align="middle">
                    
                    <Form.Item

                    style={{
                        width: '85%',
                    }}
                    name={"name"}
                    label="Nombre"
                    rules={[{ required: true, message: 'Campo obligatorio' }]}
                    >
                        <Input/>
                    </Form.Item>
                    
                    <Form.List 
                    name="items"
                    rules={[

                        {
                          validator: async (_, names) => {
                            if (!names || names.length < 2) {
                              return Promise.reject(new Error('Requerido Minimo 2 ingredientes'));
                            }
                          },
                        },
                    ]}
                    >
                    {(fields, { add, remove } , { errors }) => (
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
                                name={[name, 'ingredientes']}
                                rules={[
                                {
                                    required: true,
                                    message: 'Missing ingredient',
                                },
                                ]}
                            >
                                <Input  placeholder="ingredient" />
                            </Form.Item>
                            <CloseOutlined onClick={() => remove(name)} />
                            </div>
                        ))}
                        <Form.Item
                        style={{
                            width: '85%',
                        }}
                        >
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Nuevo Ingrediente
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                        
                        </>  
                    )}
                    </Form.List>
                    
                    </div>
                    
            <Form.Item
                className="my-form-container"
                >
                <div className='half-width-slot-profile-btnRP'>
                    <div className='btnBlueRP'>
                        <Button type="primary" shape="round" htmlType="submit"> Crear </Button>     
                    </div>
                    <div>
                        <Button danger type="primary" shape="round" onClick={navTo}> Cancelar </Button>
                    </div>
                </div>
            </Form.Item>
            </Card>       
            </Form>
        </div>
        </Grid> 
        </Grid> 
        </React.Fragment>
    );
}

