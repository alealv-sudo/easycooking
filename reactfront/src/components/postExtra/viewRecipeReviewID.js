import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BlogCommentSection } from "replyke";
import { Grid } from "@mui/material";
import { RollbackOutlined } from "@ant-design/icons";

import { Typography, Form, Input, Button, Card, Spin, Rate } from "antd";

import { Link } from "react-router-dom";

import "./generalPost.css";

const { Meta } = Card;

const ViewReviewID = () => {
  const [cookies, setCookie] = useCookies(["userToken"]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);

  const [reviewPost, setReviewPost] = useState();
  const [recipe, setRecipe] = useState();
  const [rating, setRating] = useState({ score: 0 });
  const [isEmpty, setIsEmpty] = useState(true);

  const [ImgURL, setURL] = useState([]);
  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  });

  const [idRecipeComments, setIdRecipeComments] = useState(0);
  const idUserToComment = cookies.id;
  const nameUserToComment = cookies.user;
  const user = {
    _id: idUserToComment,
    name: nameUserToComment,
  };

  const [creator, setCreator] = useState([]);

  function getPost() {
    axios
      .get(process.env.REACT_APP_API_URL + "reviewPost/" + id)
      .then((response) => {
        const reviewData = response.data;
        const recipeData = reviewData.recipe;
        getRate(recipeData.id);

        if (recipeData.image_recipe.length <= 33) {
          DownloadFile(recipeData.image_recipe);
        }else{
          setURL(recipeData.image_recipe)
          setLoading(false)
        }
        
        setRecipe(recipeData);
        setReviewPost(reviewData);

        /* Ids comentarios */
        const idRecipeCM = "review " + recipeData.id + "";
        setIdRecipeComments(idRecipeCM);

        getCreator(reviewData.creatorId);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getCreator(creatorId) {
    axios
      .get(`${process.env.REACT_APP_API_URL}user/${creatorId}`)
      .then((response) => {
        const userData = response.data;

        setCreator(userData.userName);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getRate(favId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}ratings/${cookies.id}/recipes/${favId}`
      )
      .then((response) => {
        const ratingData = response.data;
        if (
          ratingData.length !== 0 &&
          ratingData !== undefined &&
          ratingData !== null
        ) {
          setRating(ratingData);
          setIsEmpty(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const DownloadFile = (image_recipe) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}google/download/${image_recipe}`, {
        responseType: "blob",
      })
      .then((res) => {
        let url;

        if (image_recipe === "1") {
          url =
            "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505";
        } else {
          url = URL.createObjectURL(
            new Blob([res.data], { type: "image/png" })
          );
        }

        setURL(url);

        setLoading(false);

        return () => {
          URL.revokeObjectURL(url);
        };
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function navTo(idRecipe) {
    navigate("/private/viewRecipe/" + idRecipe);
  }

  useEffect(() => {
    getPost();
  }, []);

  const navExit = () => {
    navigate(-1);
  };

  /* Render */

  if (isLoading) {
    return (
      <div style={{ textAlignLast: "center" }}>
        <br />
        <br />
        <Spin color="#000106" tip="Loading..." />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Grid
        container
        spacing={1}
        xs={12}
        justifyContent={{ xs: "center", md: "space-evenly" }}
        alignContent={"center"}
      >
        <Grid item width={"100%"} md={9}>
          <div className="all-page">
            <div className="bottom-page-nav">
              <div className="buttom-div-nav">
                <Button
                  type="default"
                  size="large"
                  style={{
                    fontSize: "20px",
                    height: "50px",
                    width: "90px",
                  }}
                  onClick={() => navExit()}
                >
                  <RollbackOutlined />
                </Button>
              </div>
            </div>
            {/* Form Receta */}
            <div className="div-general-post-view-review">
              <Card
                className="post-card-recipe"
                size="default"
                actions={[
                  <Link
                    style={{ color: "black" }}
                    to={`/private/user/${reviewPost.creatorId}`}
                  >
                    Creador: {creator}
                  </Link>,
                ]}
              >
                <Form
                  className="div-form-general-post"
                  layout="vertical"
                  name="recipe"
                  initialValues={{
                    title_post: reviewPost.title_post,
                    review_post: reviewPost.review_post,
                  }}
                  autoComplete="off"
                >
                  {/* Input Titulo */}
                  <Form.Item
                    className="half-width-slot-generalpost"
                    label="Titulo: "
                    name="title_post"
                  >
                    <Input disabled={true} />
                  </Form.Item>

                  {/* Biografia*/}
                  <Form.Item
                    className="half-width-slot-generalpost"
                    style={{ height: "10%" }}
                    label="Contenido: "
                    name="review_post"
                  >
                    <Input.TextArea
                      showCount={false}
                      style={{ height: "100%", resize: "none" }}
                      disabled={true}
                    />
                  </Form.Item>
                </Form>

                <div className="div-card-rate">
                  <Card
                    onClick={() => navTo(recipe.id)}
                    hoverable
                    style={{
                      width: 300,
                    }}
                    cover={<img alt="img" src={ImgURL} />}
                    actions={false}
                  >
                    <Meta
                      title={recipe.recipe_name}
                      description={recipe.description}
                    />
                  </Card>

                  <div className="bottom-page-rating">
                    <p className="text-rate-final">Puntuacion Final</p>
                    <p className="text-rate">{rating.score}</p>
                    <Rate
                      style={{ fontSize: 35, paddingTop: 5 }}
                      allowHalf
                      value={rating.score}
                      autoFocus={false}
                      disabled={true}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="bottom-page-nav">
              <div className="buttom-div-nav">
                <Button
                  type="default"
                  size="large"
                  style={{
                    fontSize: "20px",
                    height: "50px",
                    width: "90px",
                  }}
                  onClick={() => navExit()}
                >
                  <RollbackOutlined />
                </Button>
              </div>
            </div>

            <div className="div-comments-review">
              <BlogCommentSection
                apiBaseUrl={process.env.REACT_APP_API_COMMENTS_URL}
                articleId={idRecipeComments}
                callbacks={{ loginClickCallback: () => null }}
                currentUser={user}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ViewReviewID;
