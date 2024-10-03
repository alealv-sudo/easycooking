import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PostComponent from './postComponent';
import PostShowRecipes from '../recipes/postShowRecipes';
import { CircularProgress, Grid, Skeleton } from '@mui/material';
import PostDetails from './showBlogI';
import { useCookies } from 'react-cookie';
import { Input, Select, Dropdown, Menu, Form, Button, Space, Divider } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const RecipesFiltered = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  useEffect(() => {
    // searchALLIngredients()
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

  const [ingredientList, setIngredientList] = useState([]);

  //////////// SARCH DECLARATIONS /////////////////////////////////////////////
  const [valueSearch, setValueSearch] = useState('');
  const [category, setCategory] = useState(''); // Estado para la categoría seleccionada
  const [recipesFilter, setRecipesFilter] = useState('');
  const { Option } = Select;


  const searchALLIngredients = () => {

    axios.get(process.env.REACT_APP_API_URL + 'ingredients/'
    ).then((response) => {
      const ingredientListData = response.data;

      console.log(ingredientListData[0].ingredient);

      const chunkedData = [];

      // for (let i = 0; i < ingredientListData.length; i += pageSize) {
      //   chunkedData.push(ingredientListData[i].ingredient.slice(i, i + pageSize));
      // }

      setIngredientList(chunkedData);

    })
      .catch((error) => {
        console.error(error);
      });

  }


  const searchByIngredients = (ingredients) => {
    // Lógica para buscar por ingredientes
    console.log('Buscando por ingredientes:', ingredients.ingredients);

    let concatenatedIngredients = ingredients.ingredients.map(item => item.ingredient).join('*');
    let encodedIngredients = encodeURIComponent(concatenatedIngredients);

    console.log('Buscando por ingredientes:', process.env.REACT_APP_API_URL + 'post/recipes/ingredients/' + encodedIngredients);



    axios.get(process.env.REACT_APP_API_URL + 'post/recipes/ingredients/' + encodedIngredients
    ).then((response) => {
      const recipeData = response.data;
      setRecipesFilter(recipeData)

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
    if (category === 'ingredientes') {
      searchByIngredients(valueSearch);
    }
    else {
      // Nothing
    }

  };
  const [openRecipe, setOpenRecipe] = useState(false)

  const [form] = Form.useForm();


  return (
    <>
      <div>
        <Divider />
        {/* Input Ingredientes */}
        <div type="flex" justify="center" align="middle">
          <Form form={form} name="dynamic_form_nest_item" onFinish={searchByIngredients}>
            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', justifyContent: 'center' }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'ingredient']}
                        fieldKey={[fieldKey, 'ingredient']}
                        rules={[{ required: true, message: 'Por favor ingrese un ingrediente' }]}
                      >
                        <Input placeholder="Ingrediente" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Añadir ingrediente
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!form.getFieldValue('ingredients') || form.getFieldValue('ingredients').length < 1}
                    >
                      Buscar sugerencia
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>

        <Divider />



        <Grid item container xs={12} minHeight={"100%"} py={2} px={2}>
          {openRecipe && (
            <Grid item container spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'} >
              <PostShowRecipes
                id={openRecipe}
                onClose={setOpenRecipe}
              />
            </Grid>
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
                    isFaved={record.isFaved}
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