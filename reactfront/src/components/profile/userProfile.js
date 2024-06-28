import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import {
    Typography,
    Input,
    Form,
    DatePicker,
    Select,
    Button,
    Image,
    notification,
    Upload,
    message,
    Spin
} from 'antd';

import ImgCrop from 'antd-img-crop';

import { UploadOutlined } from "@ant-design/icons";

import './Profile.css';

import placeholder from '../../images/profile-i.jpg';
import placeholderback from '../../images/background-2.jpeg'
import { Tabs } from 'antd';

export default function Profile() {
    const [cookies] = useCookies(['token']);
    const [editDisabledProfile, setEditProfile] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [nationalities, setNationalities] = useState([]);
    
    // Archivos
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

    const { fileList } = state;

    const { TabPane } = Tabs;

    const props = {
        onRemove: (file) => {
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
            setState((state) => ({
                fileList: [...state.fileList, file],
            }));
            return false;
        },
        fileList,
    };

    const handleUpload = () => {
        const { fileList } = state;
        const formData = new FormData();
        fileList.forEach((file) => {
            console.log(file);
            formData.append("myFiles", file, file.name);
        });

        formData.append("folderID", user.folder)
        formData.append("personal_id", user.code)

        setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        axios
            .post(process.env.REACT_APP_API_URL + "user/profile_picture/", formData)
            .then((response) => {
                console.log(response);
                setState({
                    fileList: [],
                    uploading: false,
                });
                message.success("Profile picture updated.");
                getUser();
            })
            .catch((error) => {
                console.error(error);
                setState({
                    uploading: false,
                });
                message.error("upload failed.");
                getUser();
            });
        // {contentType: false},
        // {processData: false})
    };


    function getUser() {
        axios.get(process.env.REACT_APP_API_URL + 'user/get_personal',
            {params: {token: cookies.token, object: "Personal"}, headers: { token : cookies.token, column: "user_personal", level: 0}}
            )
            .then((response) => {
                const getUser = (response.data)
                setUser(getUser);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    
    const onFinish = (values) => {

        axios.put(process.env.REACT_APP_API_URL + 'user', {
            token: cookies.token,
            values,
            personal: {
                name: values.name,
                last_name: values.last_name,
                second_last_name: values.second_last_name,
                birthdate: values.birthdate.format(),
                hometown_city: values.hometown_city,
                hometown_country: values.hometown_country,
                gender: values.gender,
                marital_status: values.marital_status,
                bloodtype: values.bloodtype,
                profile_picture: values.profile_picture,
            },
        })
            .then((response) => {
                console.log(response);
                if (response.data.status === "User updated") {
                    
                    notification.success({
                        message: 'Se actualizó correctamente el perfil'
                    });
                    getUser();
                }
            })
            .catch((error) => {
                console.log(error);
                notification.error({
                    message: 'Hubo un error, intente nuevamente.'
                });
                getUser();
            })
        setEditProfile(!editDisabledProfile)
    };

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    return (
        <React.Fragment>
            
            {/*Form Imagen */}
            <Form
                layout="vertical"
                requiredMark={true}
                name="profile"
                initialValues={{
                    code: user.code,

                    name: user.name,
                    last_name: user.last_name,
                    second_last_name: user.second_last_name,
                    
                }}
               onFinish={onFinish}
            >
                <div className="profile-div" >
                    {/*<div className="profile-background"></div>*/}
                    <div className="profile-background">
                    <Image
                        width={'100%'}
                        height={'100%'}
                            //className="profile-img-br"
                            //src={"https://drive.google.com/uc?export=view&id=" + user.profile_picture}
                            //alt={user.name}
                            fallback={placeholderback}
                        /></div>
                    <div className="profile-img">
                    <Form.Item
                        name="profile-img-br"
                    >
                        <Image
                        width={130}
                        height={130}
                            className="profile-img-br"
                            //src={"https://drive.google.com/uc?export=view&id=" + user.profile_picture}
                            //alt={user.name}
                            fallback={placeholder}
                        />
                    </Form.Item>
                        <div>
                            <ImgCrop shape='round' grid={true} rotate={true}>
                                <Upload {...props} onChange={handleUpload}>
                                    <Button icon={<UploadOutlined />}>Cambiar foto de perfil</Button>
                                </Upload>
                            </ImgCrop>
                        </div>
                    </div>
                </div>
            </Form>

            {/*Tabs*/}
            <div className="card-container">
            <Tabs defaultActiveKey="1" type="card">
                
            <TabPane tab="Personales" key="1" forceRender>
            </TabPane>

            <TabPane tab="Domicilio" key="2" forceRender>
            </TabPane>

            <TabPane tab="Contacto" key="3" forceRender>
            </TabPane>

            <TabPane tab="Otros" key="4" forceRender>
            </TabPane>
        </Tabs>
        </div>

        </React.Fragment>
    );
}

