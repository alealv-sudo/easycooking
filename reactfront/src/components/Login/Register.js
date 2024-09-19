import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Col, Flex, Form, Input, Row, message } from 'antd';
import { MailOutlined, LockOutlined, UserSwitchOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './Login.css'

const Register = () => {

  const petitionUserName = (value) => {
    return axios
      .get(process.env.REACT_APP_API_URL + 'user/username/' + value)
      .then((response) => {
        if (!response.data) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false; // En caso de error, asumimos que el nombre de usuario existe
      });
  };

  const validateUserName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Ingrese el nombre de usuario'));
    }
    else {
      return petitionUserName(value).then((isAvailable) => {
        if (!isAvailable) {
          return Promise.reject(new Error('Nombre de usuario existente. Intente otro'));
        }
      });
    }

  }

  const petitionMail = (value) => {
    return axios
      .get(process.env.REACT_APP_API_URL + 'user/email/' + value)
      .then((response) => {
        if (!response.data) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false; // En caso de error, asumimos que el nombre de usuario existe
      });
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateMail = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Ingrese su Correo'));
    }
    else {
      if (!emailRegex.test(value)) {
        return Promise.reject(new Error('Ingrese un correo Valido'));
      }
      else {
        return petitionMail(value).then((isAvailable) => {
          if (!isAvailable) {
            return Promise.reject(new Error('Correo existente. Intente otro'));
          }
        });
      }
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Ingrese su Contraseña'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('La contraseña debe tener al menos 8 caracteres'));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error('La contraseña debe tener al menos una letra mayúscula'));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error('La contraseña debe tener al menos una letra minúscula'));
    }
    if (!/\d/.test(value)) {
      return Promise.reject(new Error('La contraseña debe tener al menos un dígito'));
    }
    if (!/[.@$!%*?&]/.test(value)) {
      return Promise.reject(new Error('La contraseña debe tener al menos un carácter especial (.@$!%*?&)'));
    }
    return Promise.resolve();
  };


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
            rules={[
              { validator: validateUserName }
            ]}
          >
            <Input placeholder="Username"
              prefix={<SmileOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Numbre</span>}
            name="name"
            rules={[
              { required: true, message: "Ingrese su Nombre" },
              { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, message: "Solo se admiten letras, espacios y acentos" }
            ]}
          >
            <Input placeholder="Nombre"
              prefix={<UserOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Apellido</span>}
            name="lastName"
            rules={[
              { required: true, message: "Ingrese su Apellido" },
              { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, message: "Solo se admiten letras, espacios y acentos" }
            ]}
          >
            <Input placeholder="Apellido"
              prefix={<UserSwitchOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Correo</span>}
            name="email"
            rules={[{ validator: validateMail }]}
          >
            <Input placeholder="Correo"
              prefix={<MailOutlined className='icon' />}
              className='input-box'
            />
          </Form.Item>


          <Form.Item
            // label={<span style={{ color: '#fff' }}>Contraseña</span>}
            name="password"
            rules={[{ validator: validatePassword }]}
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