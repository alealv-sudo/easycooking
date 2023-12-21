import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

import { 
    Typography,
    Input,
    Form,
    DatePicker,
    Select,
    Button,
    Image,
    notification,
    Upload,
    message,
    Spin    
} from 'antd';

const URI = 'http://localhost:8000/blogs/'

const publicar = () => {
    return(
        <React.Fragment>
            <Typography.Title level={2}>Publicar Receta</Typography.Title>

            {/* Form Receta */}
            <Form
                layout="vertical"
                requiredMark={true}
                name="recipe"
                initialValues={{
                    // code: user.code,

                    // name:               recipe.name,
                    // picture:            recipe.picture,
                    // type_s:             recipe.type_s,
                    // originary:          recipe.originary,
                    // preparation_time:   recipe.preparation_time,
                    // ingredients:        recipe.ingredients,
                    // preparation_mode:   recipe.preparation_mode,
                    // tips_notes:         recipe.tips_notes,
                }}
            //    onFinish={onFinish}
            >
                {/* Input Nombre */}
                <Form.Item
                    className="half-width-slot"
                    label="Nombre de la Receta"
                    name="recipe_name"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce el numbre de la receta.' }]}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

                {/* Input imagen */}


                {/* Input Tipo */}
                <Form.Item
                    className="half-width-slot"
                    label="Tipo de receta"
                    name="type_s"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce un tipo de receta.' }]}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Origen */}
                <Form.Item
                    className="half-width-slot"
                    label="Lugar de origen de receta"
                    name="originary"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce un Lugar de origen de la receta.' }]}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Tiempo de Preparacion */}
                <Form.Item
                    className="half-width-slot"
                    label="Tiempo de preparacion de la receta"
                    name="preparation_time"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Ingredientes */}
                <Form.Item
                    className="half-width-slot"
                    label="Ingredientes de la receta"
                    name="ingredients"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce los ingredientes de la receta.' }]}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Metodo de Preparacion */}
                <Form.Item
                    className="half-width-slot"
                    label="Describa la preparacion de la receta"
                    name="preparation_mode"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce la preparacion de la receta.' }]}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Tips y Notas */}
                <Form.Item
                    className="half-width-slot"
                    label="Tips & Notes"
                    name="tips_notes"
                    normalize={value => (value || '').toUpperCase()}
                >
                    <Input
                        disabled={false}
                    />
                </Form.Item>

            </Form>
        </React.Fragment>
    )
}

export default publicar