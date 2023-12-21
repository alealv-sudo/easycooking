import axios from 'axios'
import React, {useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { Table } from 'antd'

const URI = 'http://localhost:8000/blogs/'

const usurio = () => {
    return(
        <div className='container'>
           <p>Esto es el usuario</p>
        </div>
    )
}

export default usurio