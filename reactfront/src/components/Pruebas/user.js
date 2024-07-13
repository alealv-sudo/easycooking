import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
    Typography,
    Image,
    Spin
} from 'antd';

import '../profile/Profile.css';

import { Tabs } from 'antd';

dayjs.extend(customParseFormat);
const { Text } = Typography;

const dateFormat = 'DD-MM-YYYY';
const typeImg = "profile"
const typeImgBG = "back"

export default function Profile() {
    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const [placeholderProfile ,setPlaceholderProfile] = useState()
    const [placeholderBackground ,setPlaceholderBackground] = useState()

    ///Tabs
    const { TabPane } = Tabs;

    /*Get User / Obtener datos de usuario y perfil*/
    
    function getUser() {
        axios.get(process.env.REACT_APP_API_URL + 'user/'  + cookies.id)
            .then((response) => {
                const userData = (response.data)
                const profileData = userData.profile

                profileData[['fechaDeNacimiento']] = dayjs(profileData[['fechaDeNacimiento']], dateFormat)

                const userTemp = {
                    username: userData.userName,
                    email: userData.email
                }

                if (profileData.idPictureProfile !== "1" || profileData.idPictureProfile !== null) {
                    DownloadFile(profileData.idPictureProfile,typeImg)
                }

                if (profileData.idPictureBackground !== "1" || profileData.idPictureBackground !== null) {
                    DownloadFile(profileData.idPictureBackground,typeImgBG)
                }
                
                setUser(userTemp);
                setProfile(profileData)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    ///Fin getters 
    const DownloadFile = (image_recipe, typeI) => {
        axios.get(process.env.REACT_APP_API_URL + "google/download/" + image_recipe, { responseType: "blob" })
            .then((res) => {
                // Get IMG in format BLOB
                // Crear una URL a partir del blob
                const url = URL.createObjectURL(new Blob([res.data], { type: 'image/png' }));

                if (typeI === "profile") {
                    setPlaceholderProfile(url)
                    
                }else{
                    setPlaceholderBackground(url)
                }
                
                // Crear un nuevo elemento de imagen y establecer la URL como src
                const img = document.createElement('img');
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
    }, []);

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    return (
        <React.Fragment>
            {/*Form Imagen */}
                <div className="profile-div" >
                    <div className="profile-background">
                        <Image
                            width={'100%'}
                            height={'100%'}
                                //className="profile-img-br"
                                //src={"https://drive.google.com/uc?export=view&id=" + user.profile_picture}
                                //alt={user.name}
                                fallback={placeholderBackground}
                        />
                </div>

                <div className='profile-btn'>
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
                                <Upload showUploadList={false} {...props}> {/*onChange={handleUpload}> shape='round' grid={true} rotate={true}*//*}
                                    <Button icon={<UploadOutlined />}>Cambiar foto de perfil</Button>
                                </Upload>
                            </ImgCrop> 
                        </div> */}
                        <Typography.Title level={5} strong>{profile.name} {profile.lastName}</Typography.Title>
                    </div>
                </div>
            </div>

            {/* Container Info Sec */}
                    
            <div className='profile-bio'>
                            <div className='profile-biografia'>
                                <Text>{profile.biografia}</Text>
                            </div>
                            <div>
                                <div className='profile-text-bio'>
                                    <div className='text-bio'>
                                    <Text  strong>País: </Text><Text>{profile.ubicacion}</Text>  
                                    </div>  
                                    <div className='text-bio'>
                                    <Text strong>Cumpleaños: </Text><Text>{profile.fechaDeNacimiento.format('DD-MM-YYYY')}</Text>
                                    </div>
                                </div>
                            </div>
                            <div>
                                 <div className='profile-text-bio'>  
                                    <div className='text-bio'>     
                                    <Text strong>Contacto: </Text><Text>{profile.contacto}</Text>
                                    </div>
                                    <div className='text-bio'>
                                    <Text strong>Sitio Web: </Text><Text>{profile.sitioWeb}</Text>
                                    </div>
                                </div>
                            </div>
            </div>
            

            {/*Tabs*/}
            <div className="card-container">
            <Tabs defaultActiveKey="1" type="card">
                
            <TabPane tab="Recetas" key="1" forceRender>
            </TabPane>

            <TabPane tab="Favoritos" key="2" forceRender>
            </TabPane>

            <TabPane tab="Seguidores" key="3" forceRender>
            </TabPane>

            <TabPane tab="Siguiendo" key="4" forceRender>
            </TabPane>
        </Tabs>
        </div>

        </React.Fragment>
    );
}

