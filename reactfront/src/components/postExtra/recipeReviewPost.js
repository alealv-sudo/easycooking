import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Grid } from "@mui/material";

import {
  Card,
  Select,
  Form,
  Input,
  Button,
  Tag,
  notification,
  Rate,
} from "antd";

import "./generalPost.css";

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? <Tag color="error">Req</Tag> : ""}
    {label}
  </>
);

const PublicarReview = () => {
  const [cookies, setCookie] = useCookies(["userToken"]);

  const [form] = Form.useForm();
  const [selectData, setSelectData] = useState([]);

  const [rating, setRating] = useState({ score: 0 });
  const [isEmpty, setIsEmpty] = useState(true);

  const navigate = useNavigate();

  function getFavorites() {
    axios
      .get(process.env.REACT_APP_API_URL + "favorites/alluser/" + cookies.id)
      .then((response) => {
        const FavoritesRes = response.data;
        const favData = FavoritesRes.map((e) => {
          return {
            value: e.recipe.id,
            label: e.recipe.recipe_name,
          };
        });
        setSelectData(favData);
        //setFavoritesData(FavoritesRes)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const onFinish = (values) => {
    const reviewPost = {
      title_post: values.title_post,
      review_post: values.review_post,
      id_recipe_review: values.favorito,
      creatorId: cookies.id,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "reviewPost/", reviewPost)
      .then(function response(response) {
        onFinishRate(values.favorito);
      })
      .catch(function error(error) {
        console.log(error);
      });
  };

  const onFinishRate = (values) => {
    const ratingValue = {
      userId: cookies.id,
      recipeId: values,
      score: rating.score,
    };

    if (isEmpty) {
      axios
        .post(`${process.env.REACT_APP_API_URL}ratings/`, ratingValue)
        .then((response) => {
          notification.success({
            message: "Post creado con exito",
          });
          Salir();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const ratingPut = {
        recipeId: values,
        userId: cookies.id,
        score: rating.score,
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}ratings/Review/`, ratingPut)
        .then((response) => {
          notification.success({
            message: "Post creado con exito",
          });
          Salir();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function setRate() {
    const favId = form.getFieldValue().favorito;

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
          form.setFieldValue("rate", ratingData.score);
          setRating(ratingData);
          setIsEmpty(false);
        } else {
          const ratingData = {
            score: 0,
          };
          form.setFieldValue("rate", ratingData.score);
          setRating(ratingData);
          setIsEmpty(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function onChangeRate(values) {
    const ratingData = {
      score: values,
    };
    setRating(ratingData);
  }

  useEffect(() => {
    getFavorites();
  }, []);

  const Salir = () => {
    navigate("/private/BLOG");
  };

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
            <div className="bottom-page-nav"></div>
            <div className="div-general-post">
              {/* Form Receta */}
              <Card
                className="post-card-recipe"
                size="default"
                title="Nueva Reseña"
              >
                <Form
                  form={form}
                  className="div-form-general-post"
                  layout="vertical"
                  name="recipe"
                  requiredMark={customizeRequiredMark}
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  {/* Input Titulo */}
                  <Form.Item
                    className="half-width-slot-generalpost"
                    label="Titulo"
                    name="title_post"
                    normalize={(value) => (value || "").toUpperCase()}
                    rules={[{ required: true, message: "Campo Obligatorio." }]}
                  >
                    <Input disabled={false} />
                  </Form.Item>

                  {/* Biografia*/}
                  <Form.Item
                    className="half-width-slot-generalpost"
                    style={{ height: "10%" }}
                    label="Contenido"
                    name="review_post"
                    normalize={(value) => value || ""}
                    rules={[{ required: true, message: "Campo Obligatorio." }]}
                  >
                    <Input.TextArea
                      showCount
                      maxLength={500}
                      placeholder="Contenido"
                      style={{ height: "100%", resize: "none" }}
                      disabled={false}
                    />
                  </Form.Item>

                  <div type="flex" justify="center" align="middle">
                    {/* Input Tipo */}
                    <Form.Item
                      className="half-width-slot"
                      type="flex"
                      justify="center"
                      align="middle"
                      label="Receta a reseñar"
                      name="favorito"
                      rules={[{ required: true, message: "Campo requerido" }]}
                    >
                      <Select
                        disabled={false}
                        showSearch
                        options={selectData}
                        onChange={() => setRate()}
                      ></Select>
                    </Form.Item>
                  </div>

                  <Form.Item label="score: " name="rate" valuePropName="rate">
                    <div className="bottom-page-rating">
                      <p className="text-rate">{rating.score}</p>
                      <Rate
                        style={{ fontSize: 35, paddingTop: 5 }}
                        allowHalf
                        value={rating.score}
                        autoFocus={false}
                        onChange={onChangeRate}
                      />
                    </div>
                  </Form.Item>

                  {/* Boton Submit */}
                  <Form.Item className="half-width-slot-generalpost">
                    <div className="half-width-slot-profile-btnGP">
                      <div className="btnBlueGP">
                        <Button type="primary" htmlType="submit">
                          {" "}
                          Publicar{" "}
                        </Button>
                      </div>
                      <div>
                        <Button
                          danger
                          type="primary"
                          onClick={Salir}
                        >
                          {" "}
                          Cancelar{" "}
                        </Button>
                      </div>
                    </div>
                  </Form.Item>
                </Form>
              </Card>
            </div>
            <div className="bottom-page-nav"></div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PublicarReview;
