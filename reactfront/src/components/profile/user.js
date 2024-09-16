import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Typography, Image, Spin } from "antd";

import FollowersList from "./followersList.js";
import ProfilePost from "./profilepost.js";
import FollowButton from "./followButton";
import "./Profile.css";

import { Tabs, Card } from "antd";

dayjs.extend(customParseFormat);
const { Text } = Typography;

const dateFormat = "DD-MM-YYYY";
const typeImg = "profile";
const typeImgBG = "back";
const postRoute = "post";
const favoriteRoute = "favorites";
const followedRoute = "followeds";
const followerRoute = "followers";

export default function Profile() {

  const [cookies, setCookie] = useCookies(["userToken"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [isFollowed, setFollowed] = useState()
  const [isDataFollow, setIsDataFollow] = useState()

  const [placeholderProfile, setPlaceholderProfile] = useState();
  const [placeholderBackground, setPlaceholderBackground] = useState();

  /*Get User / Obtener datos de usuario y perfil*/

  function getUser() {
    axios
      .get(process.env.REACT_APP_API_URL + "user/" + id)
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

        if (
          profileData.idPictureProfile !== "1" ||
          profileData.idPictureProfile !== null
        ) {
          DownloadFile(profileData.idPictureProfile, typeImg);
        }

        if (
          profileData.idPictureBackground !== "1" ||
          profileData.idPictureBackground !== null
        ) {
          DownloadFile(profileData.idPictureBackground, typeImgBG);
        }

        setUser(userTemp);
        setProfile(profileData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function isFollow() {

    axios
      .get(process.env.REACT_APP_API_URL + "followeds/isfollowed?id=" + cookies.id + '&followedId=' + id)
      .then((response) => {
        const data = response.data.data
        const isfollowed = response.data.isFollowed
        setFollowed(isfollowed)
        isfollowed ? setIsDataFollow(data.id) : setIsDataFollow(null)
      })
      .catch((error) => {
        console.log(error);
      });

  }

  ///Fin getters
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

        if (typeI === "profile") {
          setPlaceholderProfile(url);
        } else {
          setPlaceholderBackground(url);
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

  ///Funciones extras

  useEffect(() => {
    getUser();
    isFollow();
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlignLast: "center" }}>
        <br />
        <br />
        <Spin color="#000106" tip="Loading..." />
      </div>
    );
  }

  const data = [
    {
      label: "Publicaciones",
      key: "Publicaciones",
      children: <ProfilePost route={postRoute} userId={id} isUser={true} />,
    },
    {
      label: "Favoritos",
      key: "Favoritos",
      children: <ProfilePost route={favoriteRoute} userId={id} isUser={true}/>,
    },
    {
      label: "Seguidos",
      key: "Seguidos",
      children: <FollowersList route={followedRoute} userId={id} isUser={true}/>,
      destroyInactiveTabPane: true
    },
    {
      label: "Seguidores",
      key: "Seguidores",
      children: <FollowersList route={followerRoute} userId={id} isUser={true}/>,
      destroyInactiveTabPane: true
    },
  ];


  return (
    <React.Fragment>
      {/*Form Imagen */}
      <div className="general-page">
        <div className="profile-div">
        <Card style={{ width: "100%" }}>
            <div className="profile-background">
            <Image
                width={"100%"}
                height={"100%"}
                //className="profile-img-br"
                //src={"https://drive.google.com/uc?export=view&id=" + user.profile_picture}
                //alt={user.name}
                fallback={placeholderBackground}
            />
            </div>

            <div className="profile-btn">
            <div className="profile-img">
                <Image
                width={180}
                height={180}
                className="profile-img-br"
                //src={"https://drive.google.com/uc?export=view&id=" + user.profile_picture}
                //alt={user.name}
                fallback={placeholderProfile}
                />
                {/* <div>
                                <ImgCrop >
                                    <Upload showUploadList={false} {...props}> {/*onChange={handleUpload}> shape='round' grid={true} rotate={true}*/
                /*}
                                        <Button icon={<UploadOutlined />}>Cambiar foto de perfil</Button>
                                    </Upload>
                                </ImgCrop> 
                            </div> */}
                <Typography.Title level={5} strong>
                {profile.name} {profile.lastName}
                </Typography.Title>
            </div>
                {String(id) !== String(cookies.id) ?  
                  <div>
                    <FollowButton  idData={isDataFollow} isFollow={isFollowed} idUser={id}></FollowButton>
                  </div> 
                  : 
                  <></>
                }
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
                <Text>{profile.fechaDeNacimiento.format("DD-MM-YYYY")}</Text>
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
    </React.Fragment>
  );
}
