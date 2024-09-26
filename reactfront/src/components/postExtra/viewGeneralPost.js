import axios from 'axios'
import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { BlogCommentSection } from "replyke";
import { Grid } from '@mui/material';

import {
    Typography,
    Upload,
    Form,
    Input,
    Button,
    Tag,
    notification,
    Spin,
    message
} from 'antd';

import { Link } from 'react-router-dom';

import './generalPost.css';
const folderID = "1-tXGVcYegjmtuqVnSTSyPCujAydFonO4"

const ViewGeneralPost = () => {

    const navigate = useNavigate();
    const { id } = useParams()

    const [cookies, setCookie] = useCookies(['userToken']);

    const [gPost, setGPost] = useState()

    const [isLoading, setLoading] = useState(true);
    const [isImage, setIsimage] = useState(false);
    const [imgFileList, setFileList] = useState([]);
    
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

    const { fileList } = state;

    const [idRecipeComments, setIdRecipeComments] = useState(0)
    const idUserToComment = cookies.id
    const nameUserToComment = cookies.user
    const user = {
        _id: idUserToComment,
        name: nameUserToComment
    }

    const [creator, setCreator] = useState([])

    {/* Get post */}

    function getPost() {
        axios.get(process.env.REACT_APP_API_URL + 'generalPost/' + id,
        ).then((response) => {
            const postData = response.data;
            setGPost(postData)
            console.log(postData);
            
            if (postData.image_post_id !== '1') {
                DownloadFile(postData.image_post_id)
            }else{
                setLoading(false);
            }

            /* Ids comentarios */
            const idRecipeCM = "gpost " + postData.id + ""
            setIdRecipeComments(idRecipeCM)
            
            getCreator(postData.creatorId);
        }).catch((error) => {
            console.error(error);
        });
    }

    function getCreator(creatorId) {
        axios.get(`${process.env.REACT_APP_API_URL}user/${creatorId}`)
            .then((response) => {
                const userData = response.data;

                setCreator(userData.userName)
            })
            .catch((error) => {
                console.log(error);
            });
    }

     /* UseEffect */

     useEffect(() => {
        getPost()
     }, []);
 
    /* Funciones Archivos */

    const DownloadFile = (image_recipe, typeI) => {
        axios.get(process.env.REACT_APP_API_URL + "google/download/" + image_recipe, { responseType: "blob" })
            .then((res) => {
                // Get IMG in format BLOB
                // Crear una URL a partir del blob
                const url = URL.createObjectURL(new Blob([res.data], { type: 'image/png' }));

                const imageUpload = [
                    {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: url,
                    },
                ]
  
                setState({
                    fileList: [],
                });    
                setFileList(imageUpload);
                setState({
                    fileList: imageUpload,
                });

                setLoading(false);
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

    const Salir = () => {
        navigate("/private/BLOG");
    }

    /* Render */

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
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
        <div className='all-page'>
            <Typography.Link>
                <Link to={`/private/user/${gPost.creatorId}`}>
                    Creador: {creator}</Link>
            </Typography.Link>

            {/* Form Receta */}
            <div className='div-general-post'>
                <Form
                    className='div-form-general-post'
                    layout="vertical"
                    name="recipe"
                    initialValues={{
                        title_post: gPost.title_post,
                        text_post: gPost.text_post, 
                    }}
                    autoComplete="off"
                >
                    {/* Input imagen */}
                    {String(gPost.image_post_id) !== "1" ? (
                        <div type="flex" justify="center" align="middle">
                        <Form.Item
                            className="customSizedUploadGP"
                            justify="center" align="middle"
                            name="image_post_id"
                        >
                            <Upload
                                listType="picture-card"
                                disabled={true}
                                fileList={imgFileList}
                                onPreview={onPreview}
                                showUploadList={{ showRemoveIcon: false }}
                            >
                                {fileList.length < 1 && '+ Upload'}

                            </Upload>

                        </Form.Item>
                    </div>
                    ) : (
                        <></>
                    )}

                    {/* Input Titulo */}
                    <Form.Item
                        className="half-width-slot-generalpost"
                        label="Titulo: "
                        name="title_post"
                    >
                        <Input
                            disabled={true}
                        />
                    </Form.Item>

                    {/* Biografia*/}
                    <Form.Item
                        className="half-width-slot-generalpost"
                        style={{height: '10%'}}
                        label="Contenido: "
                        name="text_post"
                        >
                            <Input.TextArea
                                showCount={false}
                                maxLength={500}
                                placeholder="Contenido"
                                style={{height: '100%', resize: 'none'}}
                                disabled={true}
                            />
                            </Form.Item>

                </Form>
            </div>

            <div className="div-comments-review">
                <BlogCommentSection
                    apiBaseUrl="http://localhost:443"
                    articleId={idRecipeComments}
                    callbacks={{ loginClickCallback: () => null }}
                    currentUser={user}
                />
            </div>

            <div className='half-width-slot-profile-btnGP'>
                <div>
                    <Button  danger type="primary" shape="round" onClick={Salir}> Salir </Button>
                </div>
            </div>

            </div>
            </Grid>
        </Grid>
        </React.Fragment>
    );

}

export default ViewGeneralPost