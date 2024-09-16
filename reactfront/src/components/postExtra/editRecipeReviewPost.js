import axios from 'axios'
import React, { useState, useEffect, message } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import {
    Typography,
    Select,
    Form,
    Input,
    Button,
    Tag,
    notification,
    Spin,
    Rate,
} from 'antd';

import './generalPost.css';

const customizeRequiredMark = (label, { required }) => (
    <>
      {required ? <Tag color="error">Req</Tag> : ""}
      {label}
    </>
);

const EditarReview = () => {

    const [cookies, setCookie] = useCookies(['userToken']);
    const { id } = useParams()

    const [form] = Form.useForm();

    const [reviewPost, setReviewPost] = useState()
    const [isLoading, setLoading] = useState(true);

    const [selectData ,setSelectData] = useState([])
    const [rating, setRating] = useState({ score: 0 });
    const [isEmpty, setIsEmpty] = useState(true);
 
    const navigate = useNavigate();

    function getPost() {
        axios.get(process.env.REACT_APP_API_URL + 'reviewPost/' + id,
        ).then((response) => {
            const reviewData = response.data;
            console.log("data", reviewData);
            getRate(reviewData.id_recipe_review)
            setReviewPost(reviewData)
            setLoading(false);
        }).catch((error) => {
            console.error(error);
        });
    }

    function getFavorites() {
        axios.get(process.env.REACT_APP_API_URL + 'favorites/alluser/'  + cookies.id)
        .then((response) => {
            const FavoritesRes = response.data
            const favData = FavoritesRes.map((e) => {
                return{
                    value: e.recipe.id,
                    label: e.recipe.recipe_name
                }
            })
            setSelectData(favData)
            //setFavoritesData(FavoritesRes)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const onFinish = (values) => {

            const favId = values.favorito.value !== undefined ? values.favorito.value : values.favorito

            const reviewPostSend = {
                id: reviewPost.id,
                title_post: values.title_post,
                review_post: values.review_post,
                id_recipe_review: favId,
            }
    
            axios.put(process.env.REACT_APP_API_URL + 'reviewPost/', reviewPostSend)
                .then(function response(response) {
                    onFinishRate(favId)
                })
                .catch(function error(error) {
                    console.log(error);
            })
        
    }

    function getRate(favId) {

        axios.get(`${process.env.REACT_APP_API_URL}ratings/${cookies.id}/recipes/${favId}`)
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

    function setRate() {
        const favId = form.getFieldValue().favorito
        
        axios.get(`${process.env.REACT_APP_API_URL}ratings/${cookies.id}/recipes/${favId}`)
        .then((response) => {
            const ratingData = response.data;
            if (ratingData.length !== 0 && ratingData !== undefined && ratingData !== null) {
                form.setFieldValue("rate", ratingData.score)
                setRating(ratingData);
                setIsEmpty(false);
            }else{
                const ratingData = {
                    score: 0,
                }
                form.setFieldValue("rate", ratingData.score)
                setRating(ratingData)
                setIsEmpty(true)
            }
        })
        .catch((error) => {
            console.error(error);
        });
        
    }

    const onFinishRate = (values) => {
        const ratingValue = {
            userId: cookies.id,
            recipeId: values,
            score: rating.score,
        };

        if (isEmpty) {
            axios.post(`${process.env.REACT_APP_API_URL}ratings/`, ratingValue)
                .then((response) => {
                    notification.success({
                        message: "Post creado con exito",
                      });
                      Salir();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            const ratingPut = {
                recipeId: values,
                userId: cookies.id,
                score: rating.score,
            };

            axios.put(`${process.env.REACT_APP_API_URL}ratings/Review/`, ratingPut)
                .then((response) => {
                    notification.success({
                        message: "Post creado con exito",
                    });
                    Salir();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    function onChangeRate(values) {
        const ratingData = {
            score: values,
        }
        setRating(ratingData)
    }

    useEffect(() => {
        getPost()
        getFavorites()
    }, []);

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
            <Typography.Title level={2}>Editar Reseña</Typography.Title>

        <div className='all-page'>
            {/* Form Receta */}
            <div className='div-general-post'>
                <Form
                    form={form}
                    className='div-form-general-post'
                    layout="vertical"
                    name="recipe"
                    initialValues={{
                        title_post: reviewPost.title_post,
                        review_post: reviewPost.review_post,
                        favorito: {value: reviewPost.recipe.id , label: reviewPost.recipe.recipe_name}
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
                        name="review_post"
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

                    <div type="flex" justify="center" align="middle">
                        {/* Input Tipo */}
                        <Form.Item
                            className="half-width-slot"
                            type="flex" justify="center" align="middle"

                            label="Receta a reseñar"
                            name="favorito"
                            rules={[{ required: true, message: 'Campo requerido'}]}
                        >
                            <Select
                                disabled={false}
                                showSearch
                                options={selectData}
                                onChange={() => setRate()}
                            >
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                label="score: "
                name="rate"
                valuePropName="rate"
            >
                <div className="bottom-page-rating">
                    <p className="text-rate">{rating.score}</p>
                    <Rate
                        style={{ fontSize: 35, paddingTop: 5 }}
                        allowHalf
                        value={rating.score}
                        autoFocus={false}
                        onChange={onChangeRate}
                    />
                </div>
                </Form.Item>

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

export default EditarReview