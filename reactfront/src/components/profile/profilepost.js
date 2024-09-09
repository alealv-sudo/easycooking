import React, { useEffect, useState } from 'react';
import { Divider, Skeleton } from 'antd';
import { Grid} from '@mui/material';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostComponent from '../blog/postComponent';
import { useNavigate } from 'react-router-dom';

export default function ProfilePost({route}) {

  const navigate = useNavigate(); 

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMore();  // Initial load
  }, []);

  const [cookies] = useCookies(['userToken']);
  const userId = cookies.id;
  // Load more posts function
  const loadMore = () => {
    if ((maxPage == null || maxPage >= page) && !loading) {
      setLoading(true);
      axios.get(process.env.REACT_APP_API_URL + route + '/paginated?page=' + page + "&userId=" + userId)
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

  const navToViewRecipe = idRecipe => {
    navigate("/private/viewRecipe/" + idRecipe);
  }

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={recipes.length}
        next={loadMore}
        hasMore={maxPage >= page}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
      <Grid item container xs={12} minHeight={"100%"} py={2} px={2}>
          <Grid item container spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'} >
            {recipes.length > 0 ? (
              recipes.map((record, index) => (
                <Grid item key={index} xs={12} md={7} style={{ width: '100%' }}>
                  <PostComponent
                    onClick={() => navToViewRecipe(record.id)}
                    avatar={record.avatar}
                    title={record.recipe_name}
                    postPhoto={record.postPhoto && record.postPhoto === "" ? record.postPhoto : "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"}
                    userName={record.userName}
                    isLiked={record.isLiked}
                    description={record.description}
                    publishDate={record.publishDate}
                    postId={record.id}
                    likesCounter={record.likes}
                  />
                </Grid>
              ))
            ) : (<div></div>
            )}
          </Grid>
      </Grid>
      </InfiniteScroll>
    </div>
  );
};

