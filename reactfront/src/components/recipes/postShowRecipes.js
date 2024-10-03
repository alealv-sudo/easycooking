import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BlogCommentSection } from "replyke";
import { Grid, CircularProgress } from "@mui/material";

import {
  Typography,
  Upload,
  Form,
  Input,
  Space,
  Button,
  Rate,
  Row,
  Card,
  List,
} from "antd";

import "./recipePost.css";

const PostShowRecipes = ({ id, onClose }) => {
  const [cookies, setCookie] = useCookies(["userToken"]);
  const [isLoading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState("");
  const [rating, setRating] = useState({ score: 2.5 });
  const [isEmpty, setIsEmpty] = useState(true);
  const [imgFileList, setFileList] = useState([]);
  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  });

  const [ingredientList, setIngredientList] = useState([]);

  const [idRecipeComments, setIdRecipeComments] = useState(0);
  const idUserToComment = cookies.id;
  const nameUserToComment = cookies.user;
  const user = {
    _id: idUserToComment,
    name: nameUserToComment,
  };

  const { fileList } = state;
  const navigate = useNavigate();

  const [creator, setCreator] = useState([]);

  useEffect(() => {
    getRecipe();
  }, []);

  function getRecipe() {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "post/" +
          id +
          "?userId=" +
          idUserToComment
      )
      .then((response) => {
        console.log(response);

        const recipeData = response.data.post;
        const idRecipe = "" + recipeData.id + "";
        getScore(recipeData.id);
        setRecipe(recipeData);
        setIdRecipeComments(idRecipe);
        setIngredientList(recipeData.Ingredients);
        DownloadFile(recipeData.image_recipe);

        getCreator(recipeData.creatorId);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getScore(recipeId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}ratings/${cookies.id}/recipes/${recipeId}`
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

  const onFinish = (values) => {
    const ratingValue = {
      userId: cookies.id,
      recipeId: recipe.id,
      score: values,
    };

    if (isEmpty) {
      axios
        .post(`${process.env.REACT_APP_API_URL}ratings/`, ratingValue)
        .then((response) => {
          getRecipe();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const ratingPut = {
        id: rating.id,
        score: values,
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}ratings/`, ratingPut)
        .then((response) => {
          getRecipe();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(
      image.outerHTML && image.outerHTML != ""
        ? image.outerHTML
        : "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
    );
  };

  const DownloadFile = (image_recipe) => {
    if (image_recipe.length > 33) {
      let url = "";
      url = image_recipe

      const imageUpload = [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: url,
        },
      ];

      setState({
        fileList: [],
      });
      setFileList(imageUpload);
      setState({
        fileList: imageUpload,
      });

      setLoading(false);
    }
    else {
      axios
        .get(`${process.env.REACT_APP_API_URL}google/download/${image_recipe}`, {
          responseType: "blob",
        })
        .then((res) => {
          let url = "";

          if (image_recipe === "1") {
            url =
              "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505";
          } else {
            url = URL.createObjectURL(
              new Blob([res.data], { type: "image/png" })
            );
          }

          const imageUpload = [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: url,
            },
          ];

          setState({
            fileList: [],
          });
          setFileList(imageUpload);
          setState({
            fileList: imageUpload,
          });

          setLoading(false);

          return () => {
            URL.revokeObjectURL(url);
          };
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const { TextArea } = Input;

  return (
    <>
      <Grid item width={"100%"} md={9}>
        {!isLoading ? (
          <>
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
                    onClick={() => onClose()}
                  >
                    <RollbackOutlined />
                  </Button>
                </div>
              </div>

              <div className="div-general-recipe-post">
                <Card
                  className="post-card-recipe"
                  size="default"
                  actions={[
                    <Link
                      style={{ color: "black" }}
                      to={`/private/user/${recipe.creatorId}`}
                    >
                      Creador: {creator}
                    </Link>,
                  ]}
                >
                  <Form
                    layout="vertical"
                    className="div-form-general-recipe-post"
                    requiredMark={false}
                    name="recipes"
                    initialValues={{
                      id: recipe.id,
                      ingredients: recipe.Ingredients,
                      recipe_name: recipe.recipe_name,
                      preparation_time: recipe.preparation_time,
                      temperature: recipe.temperature,
                      calories: recipe.calories,
                      description: recipe.description,
                      preparation: recipe.preparation,
                      type_recipe: recipe.type_recipe,
                      originary: recipe.originary,
                      tips: recipe.tips,
                    }}
                  >
                    <Form.Item className="half-width-slot" name="recipe_name">
                      <Input
                        className="half-width-slot-title"
                        disabled={true}
                      />
                    </Form.Item>

                    <Row justify="center" align="middle">
                      <Form.Item
                        className="customSizedUploadRP"
                        justify="center"
                        align="middle"
                        label="Imagen"
                        name="image_recipe"
                      >
                        <Upload
                          listType="picture-card"
                          disabled={true}
                          fileList={imgFileList}
                          showUploadList={{ showRemoveIcon: false }}
                          onPreview={onPreview}
                        >
                          {fileList.length < 1 && "+ Upload"}
                        </Upload>
                      </Form.Item>
                    </Row>

                    <Row className="row-recipe" justify="center" align="middle">
                      <Space className="btnBlueRP">
                        <Form.Item
                          className="half-width-slot"
                          label="Tiempo de preparación"
                          name="preparation_time"
                        >
                          <Input
                            placeholder="Tiempo en Minutos"
                            disabled={true}
                          />
                        </Form.Item>
                      </Space>

                      <Space className="btnBlueRP">
                        <Form.Item
                          className="half-width-slot"
                          label="Temp Preparación"
                          name="temperature"
                        >
                          <Input
                            placeholder="Temperatura en °C"
                            disabled={true}
                          />
                        </Form.Item>
                      </Space>

                      <Space className="btnBlueRP">
                        <Form.Item
                          className="half-width-slot"
                          label="Calorias"
                          name="calories"
                        >
                          <Input
                            placeholder="Cantidad de Calorias"
                            disabled={true}
                          />
                        </Form.Item>
                      </Space>

                      <Space>
                        <Form.Item
                          className="half-width-slot"
                          label="Origen"
                          name="originary"
                        >
                          <Input disabled={true} />
                        </Form.Item>
                      </Space>
                    </Row>

                    <Form.Item
                      className="half-width-slot"
                      label="Descripcion"
                      name="description"
                      normalize={(value) => value || ""}
                    >
                      <Input.TextArea
                        className="colors-bg"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        disabled={true}
                      />
                    </Form.Item>

                    <label className="label-ingedient">Ingredientes</label>

                    <div type="flex" justify="center" align="middle">
                      <Form.Item name="ingredients">
                        <List
                          bordered
                          size="small"
                          dataSource={ingredientList}
                          renderItem={(item) => (
                            <List.Item>{item.ingredient}</List.Item>
                          )}
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      className="half-width-slot"
                      label="Preparacion"
                      name="preparation"
                      normalize={(value) => value || ""}
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor introduce la preparacion de la receta.",
                        },
                      ]}
                    >
                      <Input.TextArea
                        className="colors-bg"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        disabled={true}
                      />
                    </Form.Item>

                    <Row justify="center" align="middle">
                      <Space className="btnBlueRP">
                        <Form.Item
                          className="half-width-slot"
                          label="Tipo de receta"
                          name="type_recipe"
                          normalize={(value) => (value || "").toUpperCase()}
                        >
                          <Input disabled={true} />
                        </Form.Item>
                      </Space>

                      <Space>
                        <Form.Item
                          className="half-width-slot"
                          label="País"
                          name="originary"
                          normalize={(value) => (value || "").toUpperCase()}
                        >
                          <Input disabled={true} />
                        </Form.Item>
                      </Space>
                    </Row>

                    <Form.Item
                      className="half-width-slot"
                      label="Tips & Notes"
                      name="tips"
                      normalize={(value) => value || ""}
                    >
                      <Input.TextArea
                        className="colors-bg"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        disabled={true}
                      />
                    </Form.Item>
                  </Form>

                  <div className="div-general-recipe-post2">
                    <div className="bottom-page-rating">
                      <p className="text-rate">{rating.score}</p>
                      <Rate
                        style={{ fontSize: 35, paddingTop: 5 }}
                        allowHalf
                        defaultValue={rating.score}
                        autoFocus={false}
                        onChange={onFinish}
                      />
                      <p className="text-title-score">califica esta receta</p>
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
                    onClick={() => onClose()}
                  >
                    <RollbackOutlined />
                  </Button>
                </div>
              </div>

              <div className="div-comments-page">
                <BlogCommentSection
                  apiBaseUrl={process.env.REACT_APP_API_COMMENTS_URL}
                  articleId={idRecipeComments}
                  callbacks={{ loginClickCallback: () => null }}
                  currentUser={user}
                />
              </div>
            </div>
          </>
        ) : (
          <Grid item width={"100%"} md={12}>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default PostShowRecipes;
