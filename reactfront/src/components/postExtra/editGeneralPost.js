import axios from 'axios'
import React, { useState, useEffect, message } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import {
    Typography,
    Upload,
    Form,
    Input,
    Button,
    Tag,
    notification,
    Spin,
} from 'antd';

import './generalPost.css';
const folderID = "1-tXGVcYegjmtuqVnSTSyPCujAydFonO4"

const TemporalPostID = 7;

const customizeRequiredMark = (label, { required }) => (
    <>
      {required ? <Tag color="error">Req</Tag> : ""}
      {label}
    </>
);

const EditarGeneralPost = () => {

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

    const navigate = useNavigate();

    {/* Get post */}

    function getPost() {
        axios.get(process.env.REACT_APP_API_URL + 'generalPost/' + TemporalPostID,
        ).then((response) => {
            const postData = response.data;
            setGPost(postData)

            if (postData.image_post_id !== '1') {
                DownloadFile(postData.image_post_id)
            }else{
                setLoading(false);
            }
        
        }).catch((error) => {
            console.error(error);
        });
    }

     /* UseEffect */

     useEffect(() => {
        getPost()
     }, []);
 
    /* Funciones Archivos */

    const props = {
        onRemove: (file) => {
            changeboleanfalse()
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
            changeboleantrue()
            if (state.fileList.length >= 1) {
                message.error('Solo puedes subir un archivo a la vez');
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
            const isFile = file.type === 'application/pdf'
                || file.type === 'image/png'
                || file.type === 'image/jpg'
                || file.type === 'image/jpeg'
                ;
            // If it isn't pdf then delete the file
            if (!isFile) {
                message.error('Solo puedes subir archivos PDF');
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
        fileList
    };

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

    const handleFileSubmit = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleUpload = (post_id) => {
        const { fileList } = state;
        const formData = new FormData();

        fileList.forEach((file) => {
            formData.append("myFiles", file, '-' + file.name);
        });

        formData.append("folderId", folderID);

        axios.post(process.env.REACT_APP_API_URL + "google/upload/", formData)
            .then(res => {
                updateIMG(post_id, res.data);
                deleteImage(gPost.image_post_id);
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

    const deleteImage = (image_post_id) => {

        axios.delete(process.env.REACT_APP_API_URL + "google/delete/" + image_post_id)
            .then((response) => {
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /* Peticiones a base de datos */
    const onFinish = (values) => {
            const post = {
                id: gPost.id,
                title_post: values.title_post,
                text_post: values.text_post,
                image_post_id: gPost.image_post_id,            
            }

            if (fileList.length === 0 && isImage === false) {
                post.image_post_id = '1'
            }

            axios.put(process.env.REACT_APP_API_URL + 'generalPost/', post)
                .then(function response(response) {
                    if (fileList.length !== 0 && isImage) {
                        handleUpload(gPost.id);
                    }else{
                        if(fileList.length === 0){
                            deleteImage(gPost.image_post_id)
                        }
                        notification.success({
                            message: 'Post editado con exito'
                        });
                        Salir();
                    }
                })
                .catch(function error(error) {
                    console.log(error);
            })
        
    }

    const updateIMG = (post_id, img_post_id) => {

        //put 
        const ImageGeneralPost = {
            image_post_id: img_post_id,
            id: post_id,
        }

        axios.put(process.env.REACT_APP_API_URL + 'generalPost/', ImageGeneralPost)
            .then(function response(response) {
                notification.success({
                    message: 'Post editado con exito'
                });
            })
            .catch(function error(error) {
                console.log(error);
            })
        Salir();
    }

    /* Extras */

    const  changeboleantrue = () => {
        setIsimage(true)
    }

    const  changeboleanfalse = () => {
        setIsimage(false)
    }

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
            <Typography.Title level={2}>Editar Publicacion</Typography.Title>


        <div className='all-page'>
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
                    requiredMark={customizeRequiredMark}
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    {/* Input Titulo */}
                    <Form.Item
                        className="half-width-slot-generalpost"
                        label="Titulo"
                        name="title_post"
                        normalize={value => (value || '').toUpperCase()}
                        rules={[{ required: true, message: 'Campo Obligatorio.' }]}
                    >
                        <Input
                            disabled={false}
                        />
                    </Form.Item>

                    {/* Biografia*/}
                    <Form.Item
                        className="half-width-slot-generalpost"
                        style={{height: '10%'}}
                        label="Contenido"
                        name="text_post"
                        normalize={value => (value || '')}
                        rules={[{ required: true, message: 'Campo Obligatorio.'}]}
                        >
                            <Input.TextArea
                                showCount
                                maxLength={500}
                                placeholder="Contenido"
                                style={{height: '100%', resize: 'none'}}
                                disabled={false}
                            />
                            </Form.Item>

                        {/* Input imagen */}
                    <div type="flex" justify="center" align="middle">
                        <Form.Item
                            className="customSizedUploadGP"
                            justify="center" align="middle"
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
                                {fileList.length < 1 && '+ Upload'}

                            </Upload>

                        </Form.Item>
                    </div>

                    {/* Boton Submit */}
                    <Form.Item
                        className="half-width-slot-generalpost"
                    >
                        <div className='half-width-slot-profile-btnGP'>
                            <div className='btnBlueGP'>
                                <Button type="primary" shape="round" htmlType="submit"> Editar </Button>
                            </div>
                            <div>
                                <Button  danger type="primary" shape="round" onClick={Salir}> Cancelar </Button>
                            </div>
                        </div>
                    </Form.Item>

                </Form>
            </div>
        </div>
        </React.Fragment>
    );

}

export default EditarGeneralPost