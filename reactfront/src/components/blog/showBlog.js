import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PostComponent from './postComponent';
import { CircularProgress, Grid, Skeleton } from '@mui/material';
import PostDetails from './showBlogI';
import { useCookies } from 'react-cookie';

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
    </>
  );
};

export default CompShowBlog;