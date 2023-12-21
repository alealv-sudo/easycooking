import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { Table } from 'antd'
import './blog.css'

import { AuthData } from '../contexts/authContext'

const URI = 'http://localhost:8000/blogs/'

const CompShowBlog = () => {
  
    const [blogs, setBlogs] = useState([])
    const { User } = AuthData();

    console.log(User)

    useEffect( ()=> {
        getBlogs()
    },[])

    //Procedimiento Mostrar blogs

    const getBlogs = async () => {
        const res  = await axios.get(process.env.REACT_APP_API_URL + 'blogs/')
        setBlogs(res.data)//simon
    }

    //Eliminar Blog

    const deleteBlog = async (id) => {
        axios.delete(`${URI}${id}`)
        getBlogs()
    }

    ///Datos Tabla

    const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Content',
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: 'Content',
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: 'Actions',
          dataIndex: 'Actions',
          key: 'Actions',
        },
      ];

    return(
        <div className='form-personal'>
            <h>{User}</h>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>
            <Table columns={columns} dataSource={blogs}></Table>

        </div>
    )
}

export default CompShowBlog