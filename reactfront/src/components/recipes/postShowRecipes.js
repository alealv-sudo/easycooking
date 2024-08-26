import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

import {
    Typography,
    Upload,
    Form,
    Input,
    Space,
    Spin,
    Button,
    Rate,
    List,
} from 'antd';

import {
    BlogCommentSection,
} from "replyke";

import './recipePost.css';

const PostShowRecipes = () => {

    const { id } = useParams();
    
    const [cookies, setCookie] = useCookies(['userToken']);
    const [isLoading, setLoading] = useState(true);

    const [idRecipeComments, setIdRecipeComments] = useState(0)

    const [recipe, setRecipe] = useState('');
    const [ingredientList, setIngredientList] = useState([]);
    const [rating, setRating] = useState({ score: 2.5 });
    const [isEmpty, setIsEmpty] = useState(true);

    const [imgFileList, setFileList] = useState([]);
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

    const idUserToComment = cookies.id
    const nameUserToComment = cookies.user
    const user = {
        _id: idUserToComment,
        name: nameUserToComment
    }

    const { fileList } = state;

    const navigate = useNavigate(); 

    function getRecipe() {
        axios.get(process.env.REACT_APP_API_URL + 'post/' + id,
        ).then((response) => {
            const recipeData = response.data;   
            const idRecipe = "" + recipeData.id + ""         
            getScore(recipeData.id)
            setRecipe(recipeData) 
            setIdRecipeComments(idRecipe)
            setIngredientList(recipeData.Ingredients)
            DownloadFile(recipeData.image_recipe)
        })
            .catch((error) => {
                console.error(error);
            });
    }

    function getScore(recipeId) {
        axios.get(process.env.REACT_APP_API_URL + 'ratings/' + cookies.id + '/recipes/' + recipeId
        ).then((response) => {
            const ratingData = response.data    
            if(ratingData.length !== 0 && ratingData !== undefined && ratingData !== null){
                setRating(ratingData)
                setIsEmpty(false)
            }
        })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getRecipe();
    }, [])

    const Salir = () => {
        navigate("/private/blog");
    }

    const onFinish = (values) =>{
        
        const ratingValue = {
            userId: cookies.id,
            recipeId: recipe.id,
            score: values
        }

        if(isEmpty){
            axios.post(process.env.REACT_APP_API_URL + 'ratings/', ratingValue)
            .then(function response(response) {
                getRecipe()
            })
            .catch(function error(error) {
                console.log(error);
        })
        }else{
            
            const ratingPut = {
                id: rating.id,
                score: values
            }
            
            axios.put(process.env.REACT_APP_API_URL + 'ratings/', ratingPut)
            .then(function response(response) {
                getRecipe()
            })
            .catch(function error(error) {
                console.log(error);
        })
        }
    }

    /* Funciones Imagenes */

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

    const DownloadFile = (image_recipe) => {
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

    const { TextArea } = Input;
    const onChangeText = () => {
        console.log("");
        
    };

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    return (
        <React.Fragment>
            <Typography.Title level={2}>Receta</Typography.Title>
            {/* Form Receta */}

            <div className="all-page">
                <div className='div-general-recipe-post'>
                    <Form
                        layout="vertical"
                        className='div-form-general-recipe-post'
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
                        {/* Input imagen */}
                        <div type="flex" justify="center" align="middle">
                            <Form.Item
                                className="customSizedUploadRP"
                                justify="center" align="middle"
                                label="Imagen"
                                name="image_recipe"
                            >
                                <Upload
                                    listType="picture-card"
                                    disabled={true}
                                    fileList={imgFileList}
                                    showUploadList={{ showRemoveIcon: false }}
                                    onPreview={onPreview}
                                //beforeUpload={() => false} // Evita la carga automática de la imagen
                                >
                                    {fileList.length < 1 && '+ Upload'}

                                </Upload>

                            </Form.Item>
                        </div>
                        
                        {/* Input Titulo */}
                        <Form.Item
                            className="half-width-slot"
                            label="Titulo"
                            name="recipe_name"
                            normalize={value => (value || '').toUpperCase()}
                            rules={[{ required: true, message: 'Por favor introduce el numbre de la receta.' }]}
                        >
                            <Input
                                disabled={true}
                            />
                        </Form.Item>


                        <div type="flex" justify="center" align="middle">
                            {/* Input Tiempo de Preparacion */}
                            <Space className='btnBlueRP'>
                                <Form.Item
                                    className="half-width-slot"
                                    type="flex" justify="center" align="middle"


                                    label="Tiempo de preparacion"
                                    name="preparation_time"
                                    normalize={value => (value || '')}
                                    rules={[{ required: true, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                                >
                                    <Input
                                        placeholder="Tinempo en Minutos"
                                        type="number"
                                        min="0" step="15"
                                        disabled={true}
                                    />

                                </Form.Item>
                            </Space>
                            {/* Input Temperatura de Coccion */}
                            <Space className='btnBlueRP'>
                                <Form.Item
                                    className="half-width-slot"
                                    type="flex" justify="center" align="middle"

                                    label="Temp Preparacion"
                                    name="temperature"
                                    normalize={value => (value || '')}
                                    rules={[{ required: false, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                                >

                                    <Input
                                        placeholder="Temperatura en °C"
                                        type="number"
                                        min="" step="10"

                                        // disabled={isDisabledTemp}
                                        disabled={true}
                                    />
                                    {/* <Checkbox type="checkbox" label="N/A" name="N_A_Temp" onChange={handleCheckboxChange}
                                    >
                                        N/A
                                    </Checkbox> */}


                                </Form.Item>
                            </Space>
                            {/* Input Calorias */}
                            <Space>
                                <Form.Item
                                    className="half-width-slot"
                                    type="flex" justify="center" align="middle"
                                    label="Calorias"
                                    name="calories"
                                    normalize={value => (value || '')}
                                >
                                    <Input
                                        placeholder="Cantidad de Calorias"
                                        type="number"
                                        min="0"
                                        // disabled={isDisabledCalories}
                                        disabled={true}
                                    />
                                    {/* <Checkbox type="checkbox" label="N/A" name="N_A_Calories" onChange={handleCheckboxChange}
                                    >
                                        N/A
                                    </Checkbox> */}

                                </Form.Item>
                            </Space>
                        </div>

                        {/* Input Descripcion */}
                        <Form.Item
                            className="half-width-slot"
                            label="Descripcion"
                            name="description"
                            normalize={value => (value || '')}
                        >
                            <Input.TextArea
                                className="colors-bg"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                disabled={true}
                            />
                        </Form.Item>

                        {/* Input Ingredientes */}
                        <label className="label-ingedient">Ingredientes</label>

                        <div type="flex" justify="center" align="middle">
                            <Form.Item
                                name="ingredients"
                            >
                                <List
                                    bordered
                                    size="small"
                                    dataSource={ingredientList}
                                    renderItem={(item) => <List.Item>{item.ingredient}</List.Item>}
                                />
                            </Form.Item>
                        </div>

                        {/* Input Metodo de Preparacion */}
                        <Form.Item
                            className="half-width-slot"
                            label="Preparacion"
                            name="preparation"
                            normalize={value => (value || '')}
                            rules={[{ required: true, message: 'Por favor introduce la preparacion de la receta.' }]}
                        >
                            <Input.TextArea
                                className="colors-bg"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                disabled={true}
                            />
                        </Form.Item>

                        <div type="flex" justify="center" align="middle">
                            <Space className='btnBlueRP'>
                                {/* Input Tipo */}
                                <Form.Item
                                    className="half-width-slot"
                                    type="flex" justify="center" align="middle"
                                    label="Tipo de receta"
                                    name="type_recipe"
                                    normalize={value => (value || '').toUpperCase()}
                                >
                                    <Input disabled={true} ></Input>
                                </Form.Item>
                            </Space>

                            <Space>
                                {/* Input Origen */}
                                <Form.Item
                                    className="half-width-slot"
                                    type="flex" justify="center" align="middle"
                                    label="País"
                                    name="originary"
                                    normalize={value => (value || '').toUpperCase()}
                                >
                                    <Input disabled={true} ></Input>
                                </Form.Item>
                            </Space>
                        </div>

                        {/* Input Tips y Notas */}
                        <Form.Item
                            className="half-width-slot"
                            label="Tips & Notes"
                            name="tips"
                            normalize={value => (value || '')}
                        >
                            <Input.TextArea
                                className="colors-bg"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                disabled={true}
                            />
                        </Form.Item>

                        {/* Boton Submit */}
                        <Form.Item
                            className="my-form-container"
                        >
                            
                        </Form.Item>

                    </Form>

                </div>

                <div className="bottom-page">
                    <Rate allowHalf
                        defaultValue={rating.score}
                        autoFocus={false}
                        onChange={onFinish}
                    />

                    <div className='buttom-div'>
                        <div>
                            <Button danger type="primary" onClick={Salir} shape="round" > Salir </Button>
                        </div>
                    </div>
                </div>

                <div className="div-comments-page">
                    <BlogCommentSection
                        apiBaseUrl="http://localhost:443"
                        articleId={idRecipeComments}
                        callbacks={{ loginClickCallback: () => null }}
                        currentUser={user}
                    />
                </div>
            </div>

        </React.Fragment>
    );

}

export default PostShowRecipes