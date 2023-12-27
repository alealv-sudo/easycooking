import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { Button, Form, Input} from 'antd';
import {Link, useBeforeUnload} from 'react-router-dom'


import './Login.css'

const Login = () => {
    const {loginUser} = useAuthContext();

    const onFinish = (values) => {

      axios.post(process.env.REACT_APP_API_URL + 'user/email/' , {email: values.email} )
      .then(function response(response) {

        const userData = response.data
        if(userData.email === values.email && userData.password === values.password){
          loginUser(userData);
        }
      })
      .catch(function error(error) {
        console.log(error);
      })
    }

    return(
      <div className='login-background'>
        <h1>login</h1>
        <Form
        name='User'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        >
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
        
        {/* <form onSubmit={handleSubmit}>
          <input type="text" value={password} onChange={getUser}></input>
          <button type='submit'>Iniciar sesión</button>
        </form> */}
        <div>
         <Link to={"/register"}>Crear cuenta</Link>
        </div>
      </div>
    ) 
}


export default Login;