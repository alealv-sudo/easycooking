import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PostComponent from './postComponent';
import { CircularProgress, Grid, Skeleton } from '@mui/material';
import PostDetails from './showBlogI';
import { useCookies } from 'react-cookie';
import PostShowRecipes from '../recipes/postShowRecipes';

const CompShowBlog = () => {
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
  // Load more posts function
  const loadMore = () => {
    if ((maxPage == null || maxPage >= page) && !loading) {
      setLoading(true);
      axios.get(process.env.REACT_APP_API_URL + 'post/paginated?page=' + page + "&userId=" + userId)
        .then((response) => {
          const recipeData = response.data;

          console.log(page, [...recipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]); setPage((prevPage) => prevPage + 1);
          setRecipes((prevRecipes) => [...prevRecipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]);
          setPage((prevPage) => prevPage + 1);
          setMaxPage(recipeData?.totalPages ? recipeData.totalPages : page)
          setLoading(false);  // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);  // Stop loading even if there's an error
        });
    }
  };
  const [openRecipe, setOpenRecipe] = useState(false)
  return (
    <>
      <Grid item container xs={12} minHeight={"100%"} py={2} px={2}>
        {openRecipe && (
          <Grid item container  spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'} >
            <PostShowRecipes
              id={openRecipe}
              onClose={setOpenRecipe}
            />
          </Grid>
        )}
        {(
          <Grid item container spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'} display={openRecipe ? "none" : "flex"}>
            {recipes.length > 0 ? (
              recipes.map((record, index) => (
                <Grid item key={index} xs={12} md={7} style={{ width: '100%' }}>
                  <PostComponent
                    onClick={setOpenRecipe}
                    avatar={record.avatar}
                    title={record.recipe_name}
                    postPhoto={record.postPhoto && record.postPhoto == "" ? record.postPhoto : "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"}
                    userName={record.userName}
                    isLiked={record.isLiked}
                    description={record.description}
                    publishDate={record.publishDate}
                    postId={record.id}
                    likesCounter={record.likes}
                  />
                </Grid>
              ))
            ) : (<Grid item container xs={12} justifyContent={"center"} alignContent={"center"}>
              <CircularProgress />
            </Grid>
            )}
            <div ref={observerRef} style={{ height: '1px' }} />
          </Grid>
        )}

      </Grid>
    </>
  );
};

export default CompShowBlog;