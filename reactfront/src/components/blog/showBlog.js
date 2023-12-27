import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import './blog.css'
import { useCookies } from 'react-cookie';

const URI = 'http://localhost:8000/blogs/'

const CompShowBlog = () => {
  
    const [cookies, setCookie] = useCookies(['userToken']);
    const [blogs, setBlogs] = useState([])

    useEffect( ()=> {
        getBlogs()
    },[])

    //Procedimiento Mostrar blogs

    const getBlogs = async () => {
       /*  const res  = await axios.get(process.env.REACT_APP_API_URL + 'blogs/')
        setBlogs(res.data)//simon */
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
            <h>cokkies</h>
            <h>nombre - {cookies.user}</h>
            <h>email - {cookies.email}</h>
            <h>id - {cookies.id}</h>
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