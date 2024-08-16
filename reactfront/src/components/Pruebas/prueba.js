import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Image, Button } from 'antd'
import { useCookies } from 'react-cookie'

const URI = 'http://localhost:8000/blogs/'

const Prueba = () => {

    const [cookies, setCookie] = useCookies(['userToken']);
    const [recipe, setRecipe] = useState([]);

    // const { exec } = require('child_process');
    useEffect(() => {
        // getRecipe()
    }, [])

    const getRecipe = async () => {
        const res = await axios.get(process.env.REACT_APP_API_URL + 'post/'+ "3")
        
        // Datos binarios de la imagen
        const imageBinaryData = res.data.image_recipe.data; 
        // Convierte los datos binarios en una URL base64
        const base64String = btoa(String.fromCharCode(...imageBinaryData));
        const imageBase64Url = `data:image/jpeg;base64,${base64String}`;

        res.data.image_recipe = imageBase64Url

        setRecipe(res.data)
        console.log(res.data)
    }

    function runPythonScript(variable) {
        fetch(`http://localhost:5000/executeIA?num_userid=${variable}`)
            .then(response => response.json())
            .then(data => {
                console.log("Run Python Script");
                // document.getElementById('result').innerHTML = `executeIA: ${data.result}`;
                })
            .catch(error => console.error('Error:', error));
            
    }

    const onFinish = () => {

        const userId = cookies.id;
        console.log(userId);
        runPythonScript(userId)
        




        // fetch('http://localhost:5000/userId', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ userId })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
    }


    return (
        // <div>
        //    <p>Esto es la prueba</p>
        // </div>



        <div className='btnBlueRP'>
            <Button type="primary" shape="round" onClick={onFinish}> Recomendar </Button>
            <script src="../../../../../ServerIA/data_procesator.py"></script>
            
        </div>

    )
}

export default Prueba