import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { Table } from 'antd'

const URI = 'http://localhost:5000/factorial/'

export default function Prueba2() {

    const [fact, setFact] = useState()

    useEffect(() => {
        getMarketList();
    },[]);

    function getMarketList() {
        axios.get(URI  + 7)
        .then((response) => {
            setFact(response.data)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    return(
        
        <div className='container'>
           <p>{fact}</p>
        </div>
    )
}

