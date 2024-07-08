import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Col, Flex, Form, Input, Row, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Link } from 'react-router-dom';
import Password from 'antd/es/input/Password';

const Register = () => {

  const onFinish = (values) => {

    const user = {
      userName: values.username,
      email: values.email,
      password: values.password
    }

    axios.post(process.env.REACT_APP_API_URL + 'user/', user)
      .then(function response(response) {
        setProfile(values, response.data.id)
      })
      .catch(function error(error) {
        console.log(error);
      })
  }

  const setProfile = (data, id) =>{

    const profile = {
      name: data.name,
      lastName: data.lastName,
      UserModelId: id
    }

    axios.post(process.env.REACT_APP_API_URL + 'profile/', profile)
      .then(function response(response) {
        console.log(response.data);
      })
      .catch(function error(error) {
        console.log(error);
      })
  }

  return (<>
    <Flex style={{ width: "100dvw", height: "100dvh" }} align="center" justify='center' vertical>
      <Row justify="center" >
        <Col span={{ xs: 24 }}>

          <Row justify="center" textAlign="center">
            <Col span={12}>
              <h1>Registrate</h1>
            </Col>
          </Row>
          <Row justify="center">
            <Form
              name='newUser'
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Col span={{ xs: 24 }}>
                <Form.Item
                  label="Username:"
                  name="username"
                  rules={[{ required: true, message: "Ingrese el nombre de Usuario" }]}
                >
                  <Input placeholder='Nombre' />
                </Form.Item>
              </Col>
              <Col span={{ xs: 24 }}>
                <Form.Item
                  label="Nombre"
                  name="name"
                  rules={[{ required: true, message: "Ingrese su Nombre" }]}
                >
                  <Input placeholder='Correo' />
                </Form.Item>
              </Col>
              <Col span={{ xs: 24 }}>
                <Form.Item
                  label="Apellido"
                  name="lastName"
                  rules={[{ required: true, message: "Ingrese su Apellido" }]}
                >
                  <Input placeholder='Correo' />
                </Form.Item>
              </Col>
              <Col span={{ xs: 24 }}>
                <Form.Item
                  label="Correo"
                  name="email"
                  rules={[{ required: true, message: "Ingrese su Correo" }]}
                >
                  <Input placeholder='Correo' />
                </Form.Item>
              </Col>
              <Col span={{ xs: 24 }}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[{ required: true, message: "Ingrese su Contraseña" }]}
                >
                  <Input placeholder='Contraseña' />
                </Form.Item>
              </Col>
              <Col span={{ xs: 24 }}>
                <Row justify="space-evenly" gutter={[16, 16]}>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">Crear cuenta</Button>
                  </Form.Item>
                  <Form.Item
                  >
                    <Button type="primary">
                      <Link to={"/login"}>Ya tengo una cuenta</Link>
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


export default Register;