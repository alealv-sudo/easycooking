import axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { BlogCommentSection } from "replyke";
import { Grid, CircularProgress } from "@mui/material";
import { RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { Typography, Upload, Form, Input, Button, Spin, Card } from "antd";

import "./generalPost.css";

const ViewGeneralPost = ({ id, onClose }) => {
  const [cookies, setCookie] = useCookies(["userToken"]);

  const [gPost, setGPost] = useState();

  const [isLoading, setLoading] = useState(true);
  const [imgFileList, setFileList] = useState([]);

  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  });

  const { fileList } = state;

  const [idRecipeComments, setIdRecipeComments] = useState(0);
  const idUserToComment = cookies.id;
  const nameUserToComment = cookies.user;
  const user = {
    _id: idUserToComment,
    name: nameUserToComment,
  };

  const [creator, setCreator] = useState([]);

  {
    /* Get post */
  }

  function getPost() {
    axios
      .get(process.env.REACT_APP_API_URL + "generalPost/" + id)
      .then((response) => {
        const postData = response.data;
        setGPost(postData);
        console.log(postData);

        if (postData.image_post_id !== "1") {
          if (postData.image_post_id.length <= 33) {
            DownloadFile(postData.image_post_id);
          } else {
            let url = postData.image_post_id;

            const imageUpload = [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: url,
              },
            ];

            setFileList(imageUpload);
            setState({
              fileList: imageUpload,
            });
            setLoading(false);
          }
        } else {
          setLoading(false);
        }

        /* Ids comentarios */
        const idRecipeCM = "gpost " + postData.id + "";
        setIdRecipeComments(idRecipeCM);

        getCreator(postData.creatorId);
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

  /* UseEffect */

  useEffect(() => {
    console.log(13212312312);
    getPost();
  }, []);

  /* Funciones Archivos */

  const DownloadFile = (image_recipe, typeI) => {
    axios
      .get(process.env.REACT_APP_API_URL + "google/download/" + image_recipe, {
        responseType: "blob",
      })
      .then((res) => {
        // Get IMG in format BLOB
        // Crear una URL a partir del blob
        const url = URL.createObjectURL(
          new Blob([res.data], { type: "image/png" })
        );

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
        // Crear un nuevo elemento de imagen y establecer la URL como src
        const img = document.createElement("img");
        img.src = url;
        setLoading(false);
        // Revocar la URL del objeto para liberar recursos
        return () => {
          URL.revokeObjectURL(url);
        };
      })
      .catch((error) => {
        console.error(error);
        // message.error("Descarga fallida.");
      });
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
    imgWindow?.document.write(image.outerHTML);
  };

  /* Render */

  if (isLoading) {
    return (
      <Grid item width={"100%"} md={12}>
        <CircularProgress />
      </Grid>
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
                  onClick={() => onClose()}
                >
                  <RollbackOutlined />
                </Button>
              </div>
            </div>

            {/* Form Receta */}
            <div className="div-general-post">
              <Card
                className="post-card-recipe"
                size="default"
                actions={[
                  <Link
                    style={{ color: "black" }}
                    to={`/private/user/${gPost.creatorId}`}
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
                    title_post: gPost.title_post,
                    text_post: gPost.text_post,
                  }}
                  autoComplete="off"
                >
                  {/* Input Titulo */}
                  <Form.Item
                    className="half-width-slot-generalpost"
                    name="title_post"
                  >
                    <Input className="half-width-slot-title" disabled={true} />
                  </Form.Item>

                  {/* Input imagen */}
                  {String(gPost.image_post_id) !== "1" ? (
                    <div type="flex" justify="center" align="middle">
                      <Form.Item
                        className="customSizedUploadGP"
                        justify="center"
                        align="middle"
                        name="image_post_id"
                      >
                        <Upload
                          listType="picture-card"
                          disabled={true}
                          fileList={imgFileList}
                          onPreview={onPreview}
                          showUploadList={{ showRemoveIcon: false }}
                        >
                          {fileList.length < 1 && "+ Upload"}
                        </Upload>
                      </Form.Item>
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* Contenido*/}
                  <Form.Item
                    className="half-width-slot-generalpost"
                    style={{ height: "10%" }}
                    label="Contenido: "
                    name="text_post"
                  >
                    <Input.TextArea
                      showCount={false}
                      maxLength={500}
                      placeholder="Contenido"
                      style={{ height: "100%", resize: "none" }}
                      disabled={true}
                    />
                  </Form.Item>
                </Form>
                
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

export default ViewGeneralPost;
