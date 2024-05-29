import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { Button, Col, Flex, Form, Input, Row } from 'antd';
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
      <Flex style={{ width: "100dvw", height: "100dvh" }} align="center" justify='center' vertical>
        <Row justify="center" >
          <Col span={{ xs: 24 }}>

            <Row justify="center" textAlign="center">
              <Col span={12}>
                <h1>Login</h1>
              </Col>
            </Row>
            <Row justify="center">
              <Form
                name='User'
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Col span={{ xs: 24 }}>
                  <Form.Item
                    label="Correo"
                    name="email"
                    rules={[{ required: true, message: "Ingrese su Correo" }]}
                  >
                    <Input placeholder="Correo" />
                  </Form.Item>
                </Col>
                <Col span={{ xs: 24 }}> <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[{ required: true, message: "Ingrese su Contraseña" }]}
                >
                  <Input.Password placeholder="Contraseña" />
                </Form.Item>
                </Col>
                <Col span={{ xs: 24 }}>
                  <Row justify="space-evenly" gutter={[16, 16]}>
                    <Form.Item
                    >
                      <Button type="primary" htmlType="submit">Iniciar sesión</Button>
                    </Form.Item>
                    <Form.Item
                    >
                      <Button type="primary">
                        <Link to={"/register"}>Crear cuenta</Link>
                      </Button>
                    </Form.Item>

                  </Row>
                </Col>
              </Form>
            </Row>
          </Col>
        </Row>
      </Flex>
    </>
  )
}


export default Login;