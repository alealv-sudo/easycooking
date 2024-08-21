import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './blog.css'
import { useCookies } from 'react-cookie';
import PostComponent from './postComponent';
import { Grid } from '@mui/material';

import { Input } from 'antd'

const URI = 'http://localhost:8000/blogs/'

const CompShowBlog = () => {

  const [cookies, setCookie] = useCookies(['userToken']);
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    getBlogs()
  }, [])

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
      publishDate: "9/10/2024",
      userName: "alejandro",
      likesCounter: 20,
      isLiked: false,
      avatar: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      postPhoto: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      publishDate: "10/10/2024",
      userName: "francisco",
      likesCounter: 10,
      isLiked: true,
      avatar: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      postPhoto: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      publishDate: "11/10/2024",
      userName: "mario",
      likesCounter: 0,
      isLiked: false,
      avatar: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      postPhoto: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
    },
    {
      title: 'Actions',
      dataIndex: 'Actions',
      key: 'Actions',
      publishDate: "12/10/2024",
      userName: "mario",
      likesCounter: 2,
      isLiked: true,
      avatar: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      postPhoto: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
    },
  ];


  //////////// SARCH DECLARATIONS
  const [valueSearch, setValueSearch] = useState('');
  const [recipes, setRecipes] = useState('');


  const onChange = (event) => {
    setValueSearch(event.target.value);
  };

  const onSearch = (value) => {

    axios.get(process.env.REACT_APP_API_URL + 'post/recipe_name/' + value,
    ).then((response) => {
      const recipeData = response.data;
      setRecipes(recipeData)
    })
    .catch((error) => {
      console.error(error);
    });
    
    // console.log(recipes);
  };


  return (
    <div>
      <div>
        <Input.Search
          placeholder="Buscar..."
          value={valueSearch}
          onChange={onChange}
          onSearch={onSearch}
          enterButton
          style={{ width: '400px' }}
        />
        {/* Resto del código */}
      </div>

      <div>
        <Grid container gap={1} justifyContent={{ xs: "center", md: "space-evenly" }}>
          {columns.map((record, index) => {
            return (
              <Grid item container xs={10} md={3} lg={3}>
                <PostComponent key={index} avatar={record.avatar} title={record.title} postPhoto={record.postPhoto} userName={record.userName} isLiked={record.isLiked} description={"asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd"} publishDate={record.publishDate} postId={"postId"} likesCounter={record.likesCounter} />
              </Grid>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

export default CompShowBlog