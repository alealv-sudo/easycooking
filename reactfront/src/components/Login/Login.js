import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { Button, Col, Flex, Form, Input, Row } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useBeforeUnload } from 'react-router-dom'


import './Login.css'

const Login = () => {
  const { loginUser } = useAuthContext();

  const onFinish = (values) => {

    axios.post(process.env.REACT_APP_API_URL + 'user/email/', { email: values.email })
      .then(function response(response) {

        const userData = response.data
        if (userData.email === values.email && userData.password === values.password) {
          loginUser(userData);
        }
      })
      .catch(function error(error) {
        console.log(error);
      })
  }

  return (
    <>
      <div className='login-page'>
        <div className='login-background' >

          <Form
            name='User'
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <h1>Login</h1>

            <Form.Item
              // label="Correo"
              name="email"
              rules={[{ required: true, message: "Ingrese su Correo" }]}
            >
              <Input placeholder="Correo"
                prefix={<MailOutlined className='icon' />}
                className='input-box'
              />

            </Form.Item>


            <Form.Item
              // label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Ingrese su Contraseña" }]}
            >
              <Input.Password placeholder="Contraseña"
                prefix={<LockOutlined className='icon' />}
                className='input-box'

              />

            </Form.Item>

            <Col span={24}>
              <Row justify="center" textAlign="center">
                <Form.Item
                >
                  <Button type="primary" htmlType="submit">Iniciar sesión</Button>
                </Form.Item>
              </Row>
              <Row justify="center" textAlign="center">
                <Form.Item
                >

                  <p>No tienes cuenta? <Link to={"/register"} className='register-link'><br />Crear cuenta</Link></p>
                </Form.Item>
              </Row>
            </Col>
          </Form>

        </div>
      </div>
    </>
  )
}


export default Login;