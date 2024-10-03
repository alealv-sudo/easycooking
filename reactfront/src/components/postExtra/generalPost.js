import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Grid } from "@mui/material";

import {
  Typography,
  Upload,
  Form,
  Input,
  Button,
  Tag,
  message,
  notification,
  Card,
} from "antd";

import "./generalPost.css";
const folderID = "1-tXGVcYegjmtuqVnSTSyPCujAydFonO4";

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? <Tag color="error">Req</Tag> : ""}
    {label}
  </>
);

const PublicarPost = () => {
  const [cookies, setCookie] = useCookies(["userToken"]);
  const [isImage, setIsimage] = useState(false);
  const [imgFileList, setFileList] = useState([]);

  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  });

  const { fileList } = state;

  const navigate = useNavigate();

  const props = {
    onRemove: (file) => {
      changeboleanfalse();
      setState((state) => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },

    beforeUpload: (file) => {
      changeboleantrue();
      if (state.fileList.length >= 1) {
        message.error("Solo puedes subir un archivo a la vez");
        setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
        return false || Upload.LIST_IGNORE;
      }
      // Check that the file is pdf
      const isFile =
        file.type === "application/pdf" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg";
      // If it isn't pdf then delete the file
      if (!isFile) {
        message.error("Solo puedes subir archivos PDF");
        setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
        return false;
      }
      setState((state) => ({
        fileList: [...state.fileList, file],
      }));
      return false;
    },
    fileList,
  };

  const changeboleantrue = () => {
    setIsimage(true);
  };

  const changeboleanfalse = () => {
    setIsimage(false);
  };

  const onFinish = (values) => {
    const post = {
      title_post: values.title_post,
      text_post: values.text_post,
      creatorId: cookies.id,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "generalPost/", post)
      .then(function response(response) {
        if (isImage) {
          handleUpload(response.data.id);
        } else {
          notification.success({
            message: "Post creado con exito",
          });
          Salir();
        }
      })
      .catch(function error(error) {
        console.log(error);
      });
  };

  const handleFileSubmit = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const updateIMG = (post_id, img_post_id) => {
    //put
    const ImageGeneralPost = {
      image_post_id: img_post_id,
      id: post_id,
    };

    axios
      .put(process.env.REACT_APP_API_URL + "generalPost/", ImageGeneralPost)
      .then(function response(response) {
        notification.success({
          message: "Post creado con exito",
        });
      })
      .catch(function error(error) {
        console.log(error);
      });

    Salir();
  };

  const handleUpload = (post_id) => {
    const { fileList } = state;
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("myFiles", file, "-" + file.name);
    });

    formData.append("folderId", folderID);

    axios
      .post(process.env.REACT_APP_API_URL + "google/upload/", formData)
      .then((res) => {
        updateIMG(post_id, res.data);
      })
      .catch((error) => {
        console.error(error);
        setState({
          uploading: false,
        });
        //message.error("Error al subir el archivo.");
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

  useEffect(() => {}, []);

  const Salir = () => {
    navigate("/private/BLOG");
  };

  return (
    <React.Fragment>
      {/* Form Receta */}
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
              <Card
                className="post-card-recipe"
                size="default"
                title="Nuevo Post"
              >
                <Form
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
                    name="text_post"
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

                  {/* Input imagen */}
                  <div type="flex" justify="center" align="middle">
                    <Form.Item
                      className="customSizedUploadGP"
                      justify="center"
                      align="middle"
                      label="Imagen"
                      name="image_post_id"
                    >
                      <Upload
                        //action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
                        {...props}
                        fileList={imgFileList}
                        onChange={handleFileSubmit}
                        onPreview={onPreview}
                        //beforeUpload={() => false} // Evita la carga automática de la imagen
                      >
                        {fileList != null && fileList.length < 1 && "+ Upload"}
                      </Upload>
                    </Form.Item>
                  </div>

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
                          onClick={() => Salir()}
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

export default PublicarPost;
