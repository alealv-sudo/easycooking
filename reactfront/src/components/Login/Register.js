import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Col, Flex, Form, Input, Row, message } from 'antd';
import { MailOutlined, LockOutlined, UserSwitchOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './Login.css'

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

  const setProfile = (data, id) => {

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
    <div className='login-page'>
      <div className='login-background' >


        <Form
          name='newUser'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <h1>Registrate</h1>

          <Form.Item
            // label={<span style={{ color: '#fff' }}>Username</span>}
            name="username"
            rules={[{ required: true, message: "Ingrese el nombre de Usuario" }]}
          >
            <Input placeholder="Username"
              prefix={<SmileOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Numbre</span>}
            name="name"
            rules={[{ required: true, message: "Ingrese su Nombre" }]}
          >
            <Input placeholder="Nombre"
              prefix={<UserOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Apellido</span>}
            name="lastName"
            rules={[{ required: true, message: "Ingrese su Apellido" }]}
          >
            <Input placeholder="Apellido"
              prefix={<UserSwitchOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Correo</span>}
            name="email"
            rules={[{ required: true, message: "Ingrese su Correo" }]}
          >
            <Input placeholder="Correo"
              prefix={<MailOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Contraseña</span>}
            name="password"
            rules={[{ required: true, message: "Ingrese su Contraseña" }]}
          >
            <Input placeholder="Contraseña"
              prefix={<LockOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>

          <Col span={24}>
            <Row justify="space-evenly" gutter={[16, 16]}>

              <Form.Item>
                <Button type="primary" htmlType="submit">Crear cuenta</Button>
              </Form.Item>

            </Row>

            <Form.Item>
              <p>Ya tienes cuenta? <Link to={"/login"} className='register-link'><br />Iniciar sesión</Link></p>
            </Form.Item>

          </Col>
        </Form>

      </div>
    </div>
  </>

  )
}


export default Register;