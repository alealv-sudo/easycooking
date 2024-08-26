import axios from 'axios'
import React, { useState, useEffect, message } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import {
    Typography,
    Select,
    Form,
    Input,
    Button,
    Tag,
    notification,
} from 'antd';

import './generalPost.css';

const customizeRequiredMark = (label, { required }) => (
    <>
      {required ? <Tag color="error">Req</Tag> : ""}
      {label}
    </>
);

const PublicarReview = () => {

    const [cookies, setCookie] = useCookies(['userToken']);
 
    const navigate = useNavigate();

    const onFinish = (values) => {
            const reviewPost = {
                title_post: values.title_post,
                review_post: values.review_post,
                id_recipe_review: 0,
            }
    
            axios.post(process.env.REACT_APP_API_URL + 'reviewPost/', reviewPost)
                .then(function response(response) {
                    notification.success({
                        message: 'Post creado con exito'
                    });
                    Salir();
                })
                .catch(function error(error) {
                    console.log(error);
            })
        
    }

    useEffect(() => {
        
    }, []);

    const Salir = () => {
        navigate("/private/BLOG");
    }

    return (
        <React.Fragment>
            <Typography.Title level={2}>Nueva Reseña</Typography.Title>

        <div className='all-page'>
            {/* Form Receta */}
            <div className='div-general-post'>
                <Form
                    className='div-form-general-post'
                    layout="vertical"
                    name="recipe"
                    requiredMark={customizeRequiredMark}
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    {/* Input Titulo */}
                    <Form.Item
                        className="half-width-slot-generalpost"
                        label="Titulo"
                        name="title_post"
                        normalize={value => (value || '').toUpperCase()}
                        rules={[{ required: true, message: 'Campo Obligatorio.' }]}
                    >
                        <Input
                            disabled={false}
                        />
                    </Form.Item>

                    {/* Biografia*/}
                    <Form.Item
                        className="half-width-slot-generalpost"
                        style={{height: '10%'}}
                        label="Contenido"
                        name="review_post"
                        normalize={value => (value || '')}
                        rules={[{ required: true, message: 'Campo Obligatorio.'}]}
                        >
                            <Input.TextArea
                                showCount
                                maxLength={500}
                                placeholder="Contenido"
                                style={{height: '100%', resize: 'none'}}
                                disabled={false}
                            />
                    </Form.Item>

                    <div type="flex" justify="center" align="middle">
                        {/* Input Tipo */}
                        <Form.Item
                            className="half-width-slot"
                            type="flex" justify="center" align="middle"

                            label="Rellenar con lista de recetas agregadas a favoritos"
                            name="type_recipe"
                            normalize={value => (value || '').toUpperCase()}
                            rules={[{ required: false, message: 'Por favor introduce un tipo de receta.' }]}
                        >
                            <Select
                                disabled={true}
                                showSearch
                            >
                                <Select.Option value="Comida">Comida</Select.Option>
                                <Select.Option value="Bebida">Bebida</Select.Option>
                                <Select.Option value="Postre">Postre</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* Boton Submit */}
                    <Form.Item
                        className="half-width-slot-generalpost"
                    >
                        <div className='half-width-slot-profile-btnGP'>
                            <div className='btnBlueGP'>
                                <Button type="primary" shape="round" htmlType="submit"> Publicar </Button>
                            </div>
                            <div>
                                <Button  danger type="primary" shape="round" onClick={Salir}> Cancelar </Button>
                            </div>
                        </div>
                    </Form.Item>

                </Form>
            </div>
        </div>
        </React.Fragment>
    );

}

export default PublicarReview