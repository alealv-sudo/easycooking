import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';

const Register = () => {

    const onFinish = (values) =>{
      axios.post(process.env.REACT_APP_API_URL + 'user/', values)
      .then(function response(response) {
          console.log(response.data);
      })
      .catch(function error(error) {
        console.log(error);
      })
    }

    return(
      <div>
        <h1>Nuevo Usuario</h1>

        <div>
          <Form
          name='newUser'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          >
            <Form.Item
            label="Nombre de Usario"
            name="name"
            rules={[{required: true, message: "Ingrese su nombre de Usuario"}]}
            >
              <Input></Input>
            </Form.Item>

            <Form.Item
            label="Correo"
            name="email"
            rules={[{required: true, message: "Ingrese su Correo"}]}
            >
              <Input></Input>
            </Form.Item>

            <Form.Item
            label="Contraseña"
            name="password"
            rules={[{required: true, message: "Ingrese su Contraseña"}]}
            >
              <Input></Input>
            </Form.Item>

            {/* Boton Submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">Submit</Button>  
            </Form.Item>
          </Form>
        </div>
      </div>
    ) 
}


export default Register;