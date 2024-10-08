import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import PostComponent from "./postComponent";
import { CircularProgress, Grid, Skeleton } from "@mui/material";
import { useCookies } from "react-cookie";
import PostShowRecipes from "../recipes/postShowRecipes";
import { useParams } from "react-router-dom";

const UrlTem =
  "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505";

const ShowRecipeSelctor = () => {

  const { id } = useParams()

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    loadMore(); // Initial load
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.5,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]); // Adding loading to the dependency array

  const [cookies] = useCookies(["userToken"]);
  const userId = cookies.id;
  // Load more posts function
  const loadMore = () => {
    if ((maxPage == null || maxPage >= page) && !loading) {
      setLoading(true);
      console.log("url",process.env.REACT_APP_API_URL +
        "post/paginatedSelect?page=" +
        page +
        "&userId=" +
        userId + 
        "&typeRecipe=" + id);
      
      axios
        .get(
          process.env.REACT_APP_API_URL +
            "post/paginatedSelect?page=" +
            page +
            "&userId=" +
            userId + 
            "&typeRecipe=" + id
        )
        .then((response) => {
          const recipeData = response.data;

          //console.log(page, [...recipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]);
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

    for (
      let index = 0;
      index < recipeData?.posts?.length ? recipeData.posts.length : 0;
      index++
    ) {
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

  const [openRecipe, setOpenRecipe] = useState(false);
  const [openGeneralPost, setOpenGeneralPost] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  return (
    <>
      <Grid item container xs={12} minHeight={"100%"} py={2} px={2}>
        {openRecipe && (
          <Grid
            item
            container
            spacing={2}
            justifyContent={{ xs: "center", md: "space-evenly" }}
            alignContent={"center"}
          >
            <PostShowRecipes id={openRecipe} onClose={setOpenRecipe} />
          </Grid>
        )}
        {
          <Grid
            item
            container
            spacing={2}
            justifyContent={{ xs: "center", md: "space-evenly" }}
            alignContent={"center"}
            display={
              openRecipe || openReview || openGeneralPost ? "none" : "flex"
            }
          >
            {recipes.length > 0 ? (
              recipes.map((record, index) => (
                <Grid item key={index} xs={12} md={7} style={{ width: "100%" }}>
                  <PostComponent
                    onClick={
                      record.text_post
                        ? setOpenGeneralPost
                        : record.id_recipe_review
                        ? setOpenReview
                        : setOpenRecipe
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
                      record?.review_post
                        ? record.review_post
                        : record.description
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
              <Grid
                item
                container
                xs={12}
                justifyContent={"center"}
                alignContent={"center"}
              >
                <CircularProgress />
              </Grid>
            )}
            <div ref={observerRef} style={{ height: "1px" }} />
          </Grid>
        }
      </Grid>
    </>
  );
};

export default ShowRecipeSelctor;
