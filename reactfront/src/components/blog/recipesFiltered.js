import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PostComponent from './postComponent';
import { CircularProgress, Grid, Skeleton } from '@mui/material';
import PostDetails from './showBlogI';
import { useCookies } from 'react-cookie';
import { Input, Select, Dropdown, Menu } from 'antd'

const RecipesFiltered = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  useEffect(() => {
    loadMore();  // Initial load
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMore();
      }
    }, {
      root: null,
      rootMargin: '20px',
      threshold: 0.5
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);  // Adding loading to the dependency array

  const [cookies] = useCookies(['userToken']);
  const userId = cookies.id;

  //////////// SARCH DECLARATIONS /////////////////////////////////////////////
  const [valueSearch, setValueSearch] = useState('');
  const [category, setCategory] = useState('nombre'); // Estado para la categoría seleccionada
  const [recipesFilter, setRecipesFilter] = useState('');
  const { Option } = Select;


  const onChange = (event) => {
    setValueSearch(event.target.value);
  };

  const handleChange = (value) => {
    setCategory(value);
    console.log(`Categoría seleccionada: ${value}`);
  };

  const onSearch = (value) => {
    console.log(value);
    
    loadMore()
    // if (category === 'nombre') {
    //   searchByName(value);
    // } else if (category === 'ingredientes') {
    //   searchByIngredients(value);
    // }
  };

  const searchByName = (name) => {
    // Lógica para buscar por nombre
    console.log(`Buscando por nombre: ${name}`);

    axios.get(process.env.REACT_APP_API_URL + 'post/recipe_name/' + name
    ).then((response) => {
      const recipeData = response.data;
      // setRecipesFilter(recipeData)
      
      console.log(recipeData);
      console.log(page, [...recipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]); setPage((prevPage) => prevPage + 1);
      setRecipes((prevRecipes) => [...prevRecipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]);
      setPage((prevPage) => prevPage + 1);
      setMaxPage(recipeData?.totalPages ? recipeData.totalPages : page)
      setLoading(false);  // Stop loading after data is fetched
    })
      .catch((error) => {
        console.error(error);
      });

    console.log(recipesFilter);
  };

  const searchByIngredients = (ingredients) => {
    // Lógica para buscar por ingredientes
    console.log(`Buscando por ingredientes: ${ingredients}`);

    axios.get(process.env.REACT_APP_API_URL + 'post/recipes/ingredients/' + ingredients
    ).then((response) => {
      const recipeData = response.data;
      // setRecipesFilter(recipeData)
      
      console.log(recipeData);
      console.log(page, [...recipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]); setPage((prevPage) => prevPage + 1);
      setRecipes((prevRecipes) => [...prevRecipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]);
      setPage((prevPage) => prevPage + 1);
      setMaxPage(recipeData?.totalPages ? recipeData.totalPages : page)
      setLoading(false);  // Stop loading after data is fetched
    })
      .catch((error) => {
        console.error(error);
      });

    console.log(recipesFilter);
  };
  ////////////////////////////////////////////////////////////////////////////////////

  // Load more posts function
  const loadMore = () => {
    if (category === 'nombre') {
      searchByName(valueSearch);
    } else if (category === 'ingredientes') {
      searchByIngredients(valueSearch);
    }

  };
  const [openRecipe, setOpenRecipe] = useState(false)



  return (
    <>
      <div>
        <div>
          <Select defaultValue="nombre" style={{ width: 120 }} onChange={handleChange}>
            <Option value="nombre">Nombre</Option>
            <Option value="ingredientes">Ingredientes</Option>
          </Select>
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

        <Grid container minHeight={"100%"} py={2} px={2}>
          {openRecipe && (
            <PostDetails
              postId={openRecipe}
              onClose={setOpenRecipe}
            />
          )}
          <Grid item container spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'}>
            {recipes.length > 0 ? (
              recipes.map((record, index) => (
                <Grid item key={index} xs={12} md={6} lg={4} style={{ width: '100%' }}>
                  <PostComponent
                    onClick={setOpenRecipe}
                    avatar={record.avatar}
                    title={record.recipe_name}
                    postPhoto={record.postPhoto}
                    userName={record.userName}
                    isLiked={record.isLiked}
                    description={record.description}
                    publishDate={record.publishDate}
                    postId={record.id}
                    likesCounter={record.likes}
                  />
                </Grid>
              ))
            ) : (
              <CircularProgress />
            )}
            <div ref={observerRef} style={{ height: '1px' }} />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default RecipesFiltered;