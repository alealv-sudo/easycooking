import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import { Button, Form, Input} from 'antd';


import './Login.css'

const Login = () => {
    const {loginUser} = useAuthContext();
    const [password, setPassword] = useState('');

    function handleInputChange(event) {
      setPassword(event.target.value)
    }

    function handleSubmit(event) {
      event.preventDefault();
      if (password === "password") {
        loginUser("alex", password);
      }
    }

    return(
      <div className='login-background'>
        {/* <Form>
          <Form.Item label={"Email"}>
              <Input
                
                placeholder="Username"
              />
          </Form.Item>
        </Form> */}
        <h1>login</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" value={password} onChange={handleInputChange}></input>
          <button type='submit'>Iniciar sesión perro</button>
        </form>
        </div>
    ) 
}


export default Login;