import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCookies } from "react-cookie";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { CircularProgress, Grid, Skeleton } from "@mui/material";
import ViewGeneralPost from '../postExtra/viewGeneralPost';
import ViewReview from '../postExtra/viewRecipeReview';
import PostComponent from '../blog/postComponent';
import PostShowRecipes from '../recipes/postShowRecipes';
import { Divider } from 'antd';

export default function SearchByUserName() {
    const { id } = useParams();
    
  const [cookies] = useCookies(["userToken"]);
  const userId = cookies.id;

    const URL = id ? `${process.env.REACT_APP_API_URL}post/recipe_name/${id}?userId=${userId}` : null;

    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        if (id) {
            getUsers();
        }
    }, [id]);

    const getUsers = () => {
        axios.get(URL)
            .then((response) => {
                console.log("response", response.data);
                setUsersData(response?.data?.posts ? response.data.posts : []);
            })
            .catch((error) => {
                console.error(error);
            });
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
                {openGeneralPost && (
                    <Grid
                        item
                        container
                        spacing={2}
                        justifyContent={{ xs: "center", md: "space-evenly" }}
                        alignContent={"center"}
                    >
                        <ViewGeneralPost
                            id={openGeneralPost}
                            onClose={setOpenGeneralPost}
                        />
                    </Grid>
                )}
                {openReview && (
                    <Grid
                        item
                        container
                        spacing={2}
                        justifyContent={{ xs: "center", md: "space-evenly" }}
                        alignContent={"center"}
                    >
                        <ViewReview id={openReview} onClose={setOpenReview} />
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
                        {usersData != null && usersData?.length > 0 ? (<>
                            {
                                usersData.map((record, index) => (
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
                            }
                            <Divider plain>Llegaste al final de la busqueda🤐</Divider></>
                        ) : (
                            <Divider plain>Busqueda sin resultados🤐</Divider>
                        )}
                        {
                            usersData == null && (
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    justifyContent={"center"}
                                    alignContent={"center"}
                                >
                                    <CircularProgress />
                                </Grid>
                            )
                        }
                    </Grid>
                }
            </Grid>
        </>
    );
}
