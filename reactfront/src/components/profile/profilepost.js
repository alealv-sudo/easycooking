import React, { useEffect, useState } from "react";
import { Divider, Skeleton } from "antd";
import { Grid } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComponent from "../blog/postComponent";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";
import ViewGeneralPost from "../postExtra/viewGeneralPost";
import ViewReview from "../postExtra/viewRecipeReview";

const UrlTem =
  "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505";

export default function ProfilePost({ route, userId, isUser }) {
  const [cookies] = useCookies(["userToken"]);
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);

  const URL = isUser
    ? process.env.REACT_APP_API_URL +
      route +
      "/paginatedUser?page=" +
      page +
      "&userId=" +
      userId +
      "&userCurrent=" +
      cookies.id
    : process.env.REACT_APP_API_URL +
      route +
      "/paginated?page=" +
      page +
      "&userId=" +
      userId;

  useEffect(() => {
    loadMore(); // Initial load
  }, []);

  // Load more posts function
  const loadMore = () => {

    if ((maxPage == null || maxPage >= page) && !loading) {
      setLoading(true);

      axios
        .get(URL)
        .then((response) => {
          const recipeData = response.data;

          //console.log(URL ,page, [...recipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]);
          setImg(recipeData);
          setPage((prevPage) => prevPage + 1);
          setMaxPage(recipeData?.totalPages ? recipeData.totalPages : page);
          setLoading(false); // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Stop loading even if there's an error
        });
    }
  };

  async function setImg(recipeData) {
    let urlOb = [];

    for (let index = 0; index <  recipeData?.posts?.length?recipeData.posts.length:0; index++) {
      const e = recipeData.posts[index];

      let res;

      if (e.recipe_name) {
        if (e.image_recipe === "1") {
          res = UrlTem;
        } else {
          if (e.image_recipe.length <= 33) {
            let blo = await DownloadFile(e.image_recipe);
            res = window.URL.createObjectURL(blo);
          } else {
            res = e.image_recipe;
          }
        }

        const newRecipe = {
          ...e,
          imgUrl: res,
        };

        urlOb.push(newRecipe);
      } else {
        if (e.image_post_id !== undefined) {
          if (e.image_post_id === "1") {
            res = UrlTem;
          } else {
            if (e.image_post_id.length <= 33) {
              let blo = await DownloadFile(e.image_post_id);
              res = window.URL.createObjectURL(blo);
            } else {
              res = e.image_post_id;
            }
          }

          const newRecipe = {
            ...e,
            imgUrl: res,
          };

          urlOb.push(newRecipe);
        } else {
          const newRecipe = {
            ...e,
            imgUrl: "",
          };
          urlOb.push(newRecipe);
        }
      }
    }

    setRecipes((prevRecipes) => [
      ...prevRecipes,
      ...(recipeData?.posts?.length > 0 ? urlOb : []),
    ]);
  }

  const DownloadFile = async (image_recipe) => {
    let res = await axios.get(
      process.env.REACT_APP_API_URL + "google/download/" + image_recipe,
      {
        responseType: "blob",
      }
    );
    let data = res.data; //or res
    return data;
  };

  const navToViewRecipe = (idRecipe) => {
    navigate("/private/viewRecipe/" + idRecipe);
  };

  const navToGeneralPost = (idRecipe) => {
    navigate("/private/viewgpost/" + idRecipe);
  };

  const navToViewReview = (idRecipe) => {
    navigate("/private/viewreview/" + idRecipe);
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: "auto",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={recipes.length}
        next={loadMore}
        hasMore={page <= maxPage}
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
          <Grid
            item
            container
            spacing={2}
            justifyContent={{ xs: "center", md: "space-evenly" }}
            alignContent={"center"}
          >
            {recipes.length > 0 ? (
              recipes.map((record, index) => (
                <Grid item key={index} xs={12} md={7} style={{ width: "100%" }}>
                  <PostComponent
                    onClick={
                      record.text_post
                        ? () => navToGeneralPost(record.id)
                        : record.id_recipe_review
                        ? () => navToViewReview(record.id)
                        : () => navToViewRecipe(record.id)
                    }
                    avatar={record?.avatar ? record.record : ""}
                    title={
                      record.title_post ? record.title_post : record.recipe_name
                    }
                    postPhoto={record.imgUrl}
                    userName={record.userName}
                    isLiked={record.isLiked}
                    isFaved={record.isFaved}
                    description={
                      record.description
                        ? record.description
                        : record.text_post
                        ? record.text_post
                        : record.review_post
                    }
                    publishDate={record.publishDate}
                    postId={record.id}
                    likesCounter={record.likes}
                    showLikesAndFavs={
                      record.text_post || record.id_recipe_review ? false : true
                    }
                    hasImage={
                      record.id_recipe_review || record.image_post_id === "1"
                        ? false
                        : true
                    }
                  />
                </Grid>
              ))
            ) : (
              <div></div>
            )}
          </Grid>
        </Grid>
      </InfiniteScroll>
    </div>
  );
}
