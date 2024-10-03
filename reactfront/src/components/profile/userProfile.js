import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Grid } from "@mui/material";
import ImgCrop from "antd-img-crop";

import countriesData from "../recipes/countries.json";
import FollowersList from "./followersList.js";
import ProfilePost from "./profilepost.js";

import {
  Typography,
  Input,
  Form,
  DatePicker,
  Select,
  Modal,
  Button,
  Image,
  notification,
  Upload,
  message,
  Spin,
  Card,
} from "antd";

import "./Profile.css";
import { Tabs } from "antd";

dayjs.extend(customParseFormat);
const { Text } = Typography;

const dateFormat = "DD-MM-YYYY";
const folderId = "1VTuf7vltW-AFEO2NkhYtdCgISH9zsezu";
const folderIdBackground = "1RZyD5jjbzYnIuyW9N80x4kvZfrhczCZD";
const typeImg = "profile";
const typeImgBG = "back";

const postRoute = "post";
const favoriteRoute = "favorites";
const followedRoute = "followeds";
const followerRoute = "followers";
const generalPostRoute = "generalPost";
const reviewPostRoute = "reviewPost";
const likesRoute = "likes";

const url = "http://localhost:8000/";

export default function Profile() {
  const [cookies, setCookie] = useCookies(["userToken"]);
  const userId = cookies.id;

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  ///form
  const [form] = Form.useForm();

  // Imagenes
  const [placeholderProfile, setPlaceholderProfile] = useState();
  const [placeholderBackground, setPlaceholderBackground] = useState();

  const [isUpProfile, setIsUpProfile] = useState(false);
  const [isUpBackground, setIsUpBackground] = useState(false);

  const [imgFileList, setFileList] = useState([]);
  const [imgFileListBG, setFileListBG] = useState([]);

  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  });

  const [stateBG, setStateBG] = useState({
    fileListBG: [],
    uploadingBG: false,
  });

  const { fileListBG } = stateBG;
  const { fileList } = state;

  /*Get User / Obtener datos de usuario y perfil*/

  useEffect(() => {
    getUser();
    setCountries(countriesData);
  }, []);

  function getUser() {
    axios
      .get(process.env.REACT_APP_API_URL + "user/" + cookies.id)
      .then((response) => {
        const userData = response.data;
        const profileData = userData.profile;

        profileData[["fechaDeNacimiento"]] = dayjs(
          profileData[["fechaDeNacimiento"]],
          dateFormat
        );

        const userTemp = {
          username: userData.userName,
          email: userData.email,
        };

        setUser(userTemp);
        setProfile(profileData);

        if (
          profileData.idPictureProfile === "1" &&
          profileData.idPictureBackground === "1"
        ) {
          setLoading(false);
        } else {
          if (profileData.idPictureProfile !== "1") {
            DownloadFile(profileData.idPictureProfile, typeImg);
          }

          if (profileData.idPictureBackground !== "1") {
            DownloadFile(profileData.idPictureBackground, typeImgBG);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ///Fin getters

  ///consulta para editar perfil(onFinish)

  const onFinish = (values) => {
    console.log("con format", values.fechaDeNacimiento.format("DD-MM-YYYY"));
    console.log("sin format", values.fechaDeNacimiento);

    const profileTemp = {
      id: profile.id,
      name: values.name,
      lastName: values.lastName,
      biografia: values.biografia,
      ubicacion: values.ubicacion,
      contacto: values.contacto,
      sitioWeb: values.sitioWeb,
      fechaDeNacimiento: values.fechaDeNacimiento.format("DD-MM-YYYY"),
    };

    axios
      .put(process.env.REACT_APP_API_URL + "profile/", profileTemp)
      .then((response) => {
        if (
          (fileList.length !== 0 && isUpProfile) ||
          (fileListBG.length !== 0 && isUpBackground)
        ) {
          handleUpload(profile.id);
        } else {
          notification.success({
            message: "Se actualizó correctamente el perfil",
          });

          changeImgProfileFalse();
          changeImgBackgroundFalse();
          handleCancel();
          setProfile([]);
          getUser();
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Hubo un error, intente nuevamente.",
        });
        getUser();
      });
  };

  //Funciones para manejar imagenes
  const props = {
    onRemove: (file) => {
      changeImgProfileFalse();
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
      changeImgProfileTrue();
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

  const propsBG = {
    onRemove: (file) => {
      changeImgBackgroundFalse();
      setStateBG((stateBG) => {
        const index = stateBG.fileListBG.indexOf(file);
        const newFileList = stateBG.fileListBG.slice();
        newFileList.splice(index, 1);
        return {
          fileListBG: newFileList,
        };
      });
    },

    beforeUpload: (file) => {
      changeImgBackgroundTrue();
      if (stateBG.fileListBG.length >= 1) {
        message.error("Solo puedes subir un archivo a la vez");
        setStateBG((stateBG) => {
          const index = stateBG.fileListBG.indexOf(file);
          const newFileList = stateBG.fileListBG.slice();
          newFileList.splice(index, 1);
          return {
            fileListBG: newFileList,
          };
        });
        return false || Upload.LIST_IGNORE;
      }
      // Check that the file is pdf
      const isFile =
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg";
      // If it isn't pdf then delete the file
      if (!isFile) {
        message.error("Solo puedes subir archivos PDF");
        setStateBG((stateBG) => {
          const index = stateBG.fileListBG.indexOf(file);
          const newFileList = stateBG.fileListBG.slice();
          newFileList.splice(index, 1);
          return {
            fileListBG: newFileList,
          };
        });
        return false;
      }
      setStateBG((stateBG) => ({
        fileListBG: [...stateBG.fileListBG, file],
      }));
      return false;
    },
    fileListBG,
  };

  const handleFileSubmit = ({ fileList: newFileList }) => {
    // Actualiza el estado con la lista de archivos seleccionados
    setFileList(newFileList);
  };

  const handleFileSubmitBG = ({ fileList: newFileList }) => {
    // Actualiza el estado con la lista de archivos seleccionados
    setFileListBG(newFileList);
  };

  const handleUpload = (profile_id) => {
    var profileIMGId = profile.idPictureProfile;
    var backgroundIMGId = profile.idPictureBackground;

    const { fileList } = state;
    const formData = new FormData();

    const { fileListBG } = stateBG;
    const formDataBG = new FormData();

    {
      /* Filelist profile */
    }
    if (isUpProfile) {
      fileList.forEach((file) => {
        formData.append("myFiles", file, "-" + file.name);
      });

      formData.append("folderId", folderId);
    }

    {
      /* filielist background */
    }
    if (isUpBackground) {
      fileListBG.forEach((file) => {
        formDataBG.append("myFiles", file, "-" + file.name);
      });

      formDataBG.append("folderId", folderIdBackground);
    }

    {
      /* Consulta Imagen Perfil */
    }
    if (isUpProfile && isUpBackground) {
      axios
        .post(process.env.REACT_APP_API_URL + "google/upload/", formData)
        .then((resPF) => {
          profileIMGId = resPF.data;
          /* Axios para Bacground */
          axios
            .post(process.env.REACT_APP_API_URL + "google/upload/", formDataBG)
            .then((resBG) => {
              backgroundIMGId = resBG.data;
              updateIMG(profile.id, profileIMGId, backgroundIMGId);
            })
            .catch((error) => {
              //console.error(error);
              setState({
                uploading: false,
              });
              //message.error("Error al subir el archivo.");
            });
        })
        .catch((error) => {
          //console.error(error);
          setState({
            uploading: false,
          });
          //message.error("Error al subir el archivo.");
        });
    } else {
      var formPG;
      if (isUpProfile) {
        formPG = formData;
      } else {
        formPG = formDataBG;
      }

      axios
        .post(process.env.REACT_APP_API_URL + "google/upload/", formPG)
        .then((resPG) => {
          if (isUpProfile) {
            profileIMGId = resPG.data;
          } else {
            backgroundIMGId = resPG.data;
          }
          updateIMG(profile.id, profileIMGId, backgroundIMGId);
        })
        .catch((error) => {
          setState({
            uploading: false,
          });
          //message.error("Error al subir el archivo.");
        });
    }
  };

  const updateIMG = (profile_id, img_id, background_id) => {
    //put
    const ImageProfile = {
      id: profile_id,
      idPictureProfile: img_id,
      idPictureBackground: background_id,
    };

    axios
      .put(process.env.REACT_APP_API_URL + "profile/", ImageProfile)
      .then(function response(response) {
        notification.success({
          message: "Se actualizó correctamente el perfil",
        });

        setState({
          fileList: [],
        });
        setStateBG({
          fileListBG: [],
        });
        changeImgProfileFalse();
        changeImgBackgroundFalse();
        handleCancel();
        getUser();
      })
      .catch(function error(error) {
        console.log(error);
      });

    //Salir();
  };

  const DownloadFile = (image_recipe, typeI) => {
    axios
      .get(process.env.REACT_APP_API_URL + "google/download/" + image_recipe, {
        headers: { "Access-Control-Allow-Origin": "*" },
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

        if (typeI === "profile") {
          setPlaceholderProfile(url);
          setState({
            fileList: [],
          });
          setFileList(imageUpload);
          setState({
            fileList: imageUpload,
          });
        } else {
          setPlaceholderBackground(url);
          setStateBG({
            fileListBG: [],
          });
          setFileListBG(imageUpload);
          setStateBG({
            fileListBG: imageUpload,
          });
        }

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

  ///Fin funciones para manejar imagenes

  ///Funciones extras

  ///Modal booleans
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  ///Cambio de valor el booleano si hay un cambio apra imagenes

  const changeImgProfileTrue = () => {
    setIsUpProfile(true);
  };
  const changeImgProfileFalse = () => {
    setIsUpProfile(false);
  };

  const changeImgBackgroundTrue = () => {
    setIsUpBackground(true);
  };
  const changeImgBackgroundFalse = () => {
    setIsUpBackground(false);
  };

  /* data tabs */

  const data = [
    {
      label: "Recetas",
      key: "Publicaciones",
      children: <ProfilePost route={postRoute} userId={userId} isUser={true} />,
      forceRender: true,
    },
    {
      label: "Post",
      key: "Post",
      children: (
        <ProfilePost route={generalPostRoute} userId={userId} isUser={true} />
      ),
      forceRender: true,
    },
    {
      label: "Reseñas",
      key: "Review",
      children: (
        <ProfilePost route={reviewPostRoute} userId={userId} isUser={true} />
      ),
      forceRender: true,
    },
    {
      label: "Favoritos",
      key: "Favoritos",
      children: (
        <ProfilePost route={favoriteRoute} userId={userId} isUser={false} />
      ),
      forceRender: true,
    },
    {
      label: "Me gusta",
      key: "Likes",
      children: (
        <ProfilePost route={likesRoute} userId={userId} isUser={false} />
      ),
      forceRender: true,
    },
    {
      label: "Seguidos",
      key: "Seguidos",
      children: (
        <FollowersList route={followedRoute} userId={userId} isUser={false} />
      ),
      destroyInactiveTabPane: true,
    },
    {
      label: "Seguidores",
      key: "Seguidores",
      children: (
        <FollowersList route={followerRoute} userId={userId} isUser={false} />
      ),
      destroyInactiveTabPane: true,
    },
  ];

  /// Funciones extras

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
          {/*Form Imagen */}
          <div className="general-page">
            <div className="profile-div">
              <Card style={{ width: "100%" }}>
                <div className="profile-background">
                  <Image
                    width={"100%"}
                    height={"100%"}
                    fallback={placeholderBackground}
                  />
                </div>

                <div className="profile-btn">
                  <div className="profile-img">
                    <Image
                      width={180}
                      height={180}
                      className="profile-img-br"
                      fallback={placeholderProfile}
                    />
                    <Typography.Title level={5} strong>
                      {profile.name} {profile.lastName}
                    </Typography.Title>
                  </div>

                  {/*Modal y Formulario*/}
                  <div>
                    <Button type="primary" onClick={showModal}>
                      Editar perfil
                    </Button>

                    <Modal
                      title="Editar perfil"
                      open={isModalOpen}
                      footer={false}
                      onCancel={handleCancel}
                      width={"75%"}
                    >
                      <div
                        type="flex"
                        justify="center"
                        align="middle"
                        className="picture-profile-modal"
                      >
                        <div>
                          <Text strong>Imagen de Perfil</Text>
                          <ImgCrop
                            cropShape="round"
                            showGrid
                            rotationSlider
                            aspectSlider
                            showReset
                          >
                            <Upload
                              //action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                              className="customSizedUpload"
                              listType="picture-circle"
                              {...props}
                              showUploadList={{ showPreviewIcon: true }}
                              fileList={imgFileList}
                              onChange={handleFileSubmit}
                              //beforeUpload={() => false} // Evita la carga automática de la imagen
                            >
                              {imgFileList.length < 1 && "+ Upload"}
                            </Upload>
                          </ImgCrop>
                        </div>

                        <div>
                          <Text strong>Fondo de Perfil</Text>
                          <ImgCrop
                            showGrid
                            rotationSlider
                            aspectSlider
                            showReset
                          >
                            <Upload
                              //action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                              className="customSizedUploadBG"
                              listType="picture-card"
                              {...propsBG}
                              showUploadList={{ showPreviewIcon: true }}
                              fileList={imgFileListBG}
                              onChange={handleFileSubmitBG}
                              //beforeUpload={() => false} // Evita la carga automática de la imagen
                            >
                              {fileListBG.length < 1 && "+ Upload"}
                            </Upload>
                          </ImgCrop>
                        </div>
                      </div>

                      {/*Componente Form*/}
                      <Form
                        className="full-width-slot-profile"
                        layout="vertical"
                        form={form}
                        requiredMark={false}
                        name="recipes"
                        onFinish={onFinish}
                        initialValues={{
                          name: profile.name,
                          lastName: profile.lastName,
                          biografia: profile.biografia,
                          ubicacion: profile.ubicacion,
                          contacto: profile.contacto,
                          sitioWeb: profile.sitioWeb,
                          fechaDeNacimiento: profile.fechaDeNacimiento,
                        }}
                      >
                        {/* Input Nonmbre de usuario */}
                        <Form.Item
                          className="half-width-slot-profile"
                          label="Nombre"
                          name="name"
                          normalize={(value) => (value || "").toUpperCase()}
                          rules={[
                            {
                              required: true,
                              message:
                                "Por favor introduce el nombre del usuario.",
                            },
                          ]}
                        >
                          <Input disabled={false} />
                        </Form.Item>

                        {/* Input Apelido */}
                        <Form.Item
                          className="half-width-slot-profile"
                          label="Apellido"
                          name="lastName"
                          normalize={(value) => value || ""}
                          rules={[
                            { required: false, message: "Campo obligatorio" },
                          ]}
                        >
                          <Input disabled={false} />
                        </Form.Item>

                        {/* Biografia*/}
                        <Form.Item
                          className="half-width-slot-profile"
                          style={{ height: "10%" }}
                          label="Biografia"
                          name="biografia"
                          normalize={(value) => value || ""}
                          rules={[
                            {
                              required: false,
                              message:
                                "Por favor introduce los ingredientes de la receta.",
                            },
                          ]}
                        >
                          <Input.TextArea
                            showCount
                            maxLength={300}
                            placeholder="Biografia"
                            style={{ height: "100%", resize: "none" }}
                            disabled={false}
                          />
                        </Form.Item>

                        {/* Input Metodo de Contacto/Email secundario */}
                        <Form.Item
                          className="half-width-slot-profile"
                          label="Contacto"
                          name="contacto"
                          normalize={(value) => value || ""}
                          rules={[
                            {
                              required: false,
                              message:
                                "Por favor introduce la preparacion de la receta.",
                            },
                          ]}
                        >
                          <Input disabled={false} />
                        </Form.Item>

                        {/*  Sitio web */}
                        <Form.Item
                          className="half-width-slot-profile"
                          label="Sitio Web"
                          name="sitioWeb"
                          normalize={(value) => value || ""}
                          rules={[
                            {
                              required: false,
                              message:
                                "Por favor introduce la preparacion de la receta.",
                            },
                          ]}
                        >
                          <Input disabled={false} />
                        </Form.Item>

                        <Form.Item
                          className="half-width-slot-profile"
                          label="País de origen"
                          name="ubicacion"
                          normalize={(value) => (value || "").toUpperCase()}
                          rules={[
                            {
                              required: false,
                              message:
                                "Por favor introduce un Lugar de origen de la receta.",
                            },
                          ]}
                        >
                          <Select disabled={false} showSearch>
                            {countries.map((country) => (
                              <Select.Option
                                key={country.code}
                                value={country.name}
                              >
                                {country.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {/* Fecha de nacimineto */}
                        <Form.Item
                          className="half-width-slot-profile"
                          label="fecha De Nacimiento"
                          name="fechaDeNacimiento"
                        >
                          <DatePicker
                            format={"DD/MM/YYYY"}
                            showToday={false}

                            //disabled={editDisabled}
                          />
                        </Form.Item>

                        <Form.Item className="half-width-slot-profile"></Form.Item>
                        <Form.Item className="half-width-slot-profile"></Form.Item>

                        {/* Boton Submit */}
                        <Form.Item className="half-width-slot-profile">
                          <div className="half-width-slot-profile-btn">
                            <div className="btnBlue">
                              <Button type="primary" htmlType="submit">
                                {" "}
                                Actualizar{" "}
                              </Button>
                            </div>
                            <div>
                              <Button
                                danger
                                type="primary"
                                onClick={handleCancel}
                              >
                                {" "}
                                cancelar{" "}
                              </Button>
                            </div>
                          </div>
                        </Form.Item>
                      </Form>
                    </Modal>
                  </div>
                </div>

                {/* Container Info Sec */}

                <div className="profile-bio">
                  <div className="profile-biografia">
                    <Text>{profile.biografia}</Text>
                  </div>
                  <div>
                    <div className="profile-text-bio">
                      <div className="text-bio">
                        <Text strong>País: </Text>
                        <Text>{profile.ubicacion}</Text>
                      </div>
                      <div className="text-bio">
                        <Text strong>Cumpleaños: </Text>
                        <Text>
                          {profile.fechaDeNacimiento &&
                          profile.fechaDeNacimiento.format
                            ? profile.fechaDeNacimiento.format("DD-MM-YYYY")
                            : profile.fechaDeNacimiento ||
                              "Fecha no disponible"}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profile-text-bio">
                      <div className="text-bio">
                        <Text strong>Contacto: </Text>
                        <Text>{profile.contacto}</Text>
                      </div>
                      <div className="text-bio">
                        <Text strong>Sitio Web: </Text>
                        <Text>{profile.sitioWeb}</Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/*Tabs*/}

                <Card className="profile-tabs">
                  <Tabs size="large" type="card" centered items={data} />
                </Card>
              </Card>
            </div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
