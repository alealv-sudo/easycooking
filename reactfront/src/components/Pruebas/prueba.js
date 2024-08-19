import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Image, Button } from 'antd'
import { useCookies } from 'react-cookie'

const URI = 'http://localhost:8000/blogs/'

const URIIA = 'http://localhost:5000/executeIA/'

const Prueba = () => {

    const [cookies, setCookie] = useCookies(['userToken']);
    const [fact, setFact] = useState()

    useEffect(() => {
        getMarketList();
    }, [])

    function getMarketList() {
        const userId = cookies.id;

        axios.get(URIIA  + userId)
        .then((response) => {
            setFact(response.data)
            console.log(response.data);
            
        })
        .catch((error) => {
            console.log(error)
        });
    }

    return(
        
        <div className='container'>
           <p>{fact}</p>
        </div>

        // <div className='btnBlueRP'>
        //     <Button type="primary" shape="round" onClick={onFinish}> Recomendar </Button>
        // <script src="../../../../../ServerIA/data_procesator.py"></script>
        // </div>
    )


    
}

export default Prueba