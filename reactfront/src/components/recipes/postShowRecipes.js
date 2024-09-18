import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
    Row,
    Col,
    List,
} from 'antd';

import {
    BlogCommentSection,
} from "replyke";

import './recipePost.css';
import { Grid } from "@mui/material";

const PostShowRecipes = ({ id, onClose }) => {
    const [cookies, setCookie] = useCookies(['userToken']);
    const [isLoading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState('');
    const [rating, setRating] = useState({ score: 2.5 });
    const [isEmpty, setIsEmpty] = useState(true);
    const [imgFileList, setFileList] = useState([]);
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

    const [ingredientList, setIngredientList] = useState([]);

    const [idRecipeComments, setIdRecipeComments] = useState(0)
    const idUserToComment = cookies.id
    const nameUserToComment = cookies.user
    const user = {
        _id: idUserToComment,
        name: nameUserToComment
    }

    const { fileList } = state;
    const navigate = useNavigate();

    useEffect(() => {
        getRecipe();
    }, []);

    function getRecipe() {
        axios.get(process.env.REACT_APP_API_URL + 'post/' + id + "?userId=" + idUserToComment,
        ).then((response) => {
            console.log(response);

            const recipeData = response.data.post;
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
        axios.get(`${process.env.REACT_APP_API_URL}ratings/${cookies.id}/recipes/${recipeId}`)
            .then((response) => {
                const ratingData = response.data;
                if (ratingData.length !== 0 && ratingData !== undefined && ratingData !== null) {
                    setRating(ratingData);
                    setIsEmpty(false);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const onFinish = (values) => {
        const ratingValue = {
            userId: cookies.id,
            recipeId: recipe.id,
            score: values,
        };

        if (isEmpty) {
            axios.post(`${process.env.REACT_APP_API_URL}ratings/`, ratingValue)
                .then((response) => {
                    getRecipe();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            const ratingPut = {
                id: rating.id,
                score: values,
            };

            axios.put(`${process.env.REACT_APP_API_URL}ratings/`, ratingPut)
                .then((response) => {
                    getRecipe();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
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
        imgWindow?.document.write(image.outerHTML && image.outerHTML != "" ? image.outerHTML : "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505");
    };

    const DownloadFile = (image_recipe) => {
        axios.get(`${process.env.REACT_APP_API_URL}google/download/${image_recipe}`, { responseType: "blob" })
            .then((res) => {

                let url
                
                if (image_recipe === '1') {
                    url = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"
                }else{
                    url = URL.createObjectURL(new Blob([res.data], { type: 'image/png' }));
                }

                const imageUpload = [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
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

                return () => {
                    URL.revokeObjectURL(url);
                };
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const { TextArea } = Input;

    return (
        <>
            <Grid>
                {!isLoading ? (
                    <>
                        
                        <div className="all-page">
                            <Typography.Title >Receta</Typography.Title>
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
                                    <Row justify="center" align="middle">
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
                                            >
                                                {fileList.length < 1 && '+ Upload'}
                                            </Upload>
                                        </Form.Item>
                                    </Row>

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

                                    <Row justify="center" align="middle">
                                        <Space className='btnBlueRP'>
                                            <Form.Item
                                                className="half-width-slot"
                                                label="Tiempo de preparacion"
                                                name="preparation_time"
                                                normalize={value => (value || '')}
                                                rules={[{ required: true, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                                            >
                                                <Input
                                                    placeholder="Tiempo en Minutos"
                                                    type="number"
                                                    min="0" step="15"
                                                    disabled={true}
                                                />
                                            </Form.Item>
                                        </Space>

                                        <Space className='btnBlueRP'>
                                            <Form.Item
                                                className="half-width-slot"
                                                label="Temp Preparacion"
                                                name="temperature"
                                                normalize={value => (value || '')}
                                            >
                                                <Input
                                                    placeholder="Temperatura en °C"
                                                    type="number"
                                                    step="10"
                                                    disabled={true}
                                                />
                                            </Form.Item>
                                        </Space>

                                        <Space>
                                            <Form.Item
                                                className="half-width-slot"
                                                label="Calorias"
                                                name="calories"
                                                normalize={value => (value || '')}
                                            >
                                                <Input
                                                    placeholder="Cantidad de Calorias"
                                                    type="number"
                                                    min="0"
                                                    disabled={true}
                                                />
                                            </Form.Item>
                                        </Space>
                                    </Row>

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

                                    <Row justify="center" align="middle">
                                        <Space className='btnBlueRP'>
                                            <Form.Item
                                                className="half-width-slot"
                                                label="Tipo de receta"
                                                name="type_recipe"
                                                normalize={value => (value || '').toUpperCase()}
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>
                                        </Space>

                                        <Space>
                                            <Form.Item
                                                className="half-width-slot"
                                                label="País"
                                                name="originary"
                                                normalize={value => (value || '').toUpperCase()}
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>
                                        </Space>
                                    </Row>

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
                                </Form>

                                <div className="bottom-page-rating">
                                    <p className="text-rate">{rating.score}</p>
                                    <Rate
                                        style={{fontSize: 35, paddingTop: 5}}
                                        allowHalf
                                        defaultValue={rating.score}
                                        autoFocus={false}
                                        onChange={onFinish}
                                    />
                                    <p className="text-title-score">califica esta receta</p>
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

                            <div className="bottom-page">
                                <div className='buttom-div'>
                                    <Button danger type="primary" onClick={() => onClose()} shape="round">
                                        Salir
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <Spin color="#000106" tip="Loading..." />
                )}
            </Grid>
        </>
    );
}

export default PostShowRecipes;
