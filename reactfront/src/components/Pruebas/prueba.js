import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie'
import { useParams } from 'react-router-dom';
import { CircularProgress, Grid, Skeleton } from '@mui/material';
import PostDetails from '../blog/showBlogI';
import PostComponent from '../blog/postComponent';
import PostShowRecipes from '../recipes/postShowRecipes';

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


const URI = 'http://localhost:8000/blogs/'

const URIIA =  process.env.REACT_APP_API_IA_URL + 'executeIA/'

const Prueba = () => {

    const [cookies, setCookie] = useCookies(['userToken']);
    const [fact, setFact] = useState(null)

    // const { id } = useParams();
    const [recipe, setRecipe] = useState('');
    const [recipes, setRecipes] = useState([]);

    const [imgFileList, setFileList] = useState([]);
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });
    const idUserToComment = cookies.id

    const [openRecipe, setOpenRecipe] = useState(false)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMarketList();
    }, [])

    function getMarketList() {
        const userId = cookies.id;

        axios.get(URIIA + userId)
            .then((response) => {
                // console.log(response.data);
                const matches = response.data.match(/\[(.*?)\]/);

                // Verificar si se encontraron coincidencias
                if (matches && matches[1]) {
                    const array = matches[1].split(',').map(Number);
                    setFact(array)
                    // getRecipe()
                }

            })
            .catch((error) => {
                console.log(error)
            });
    }

    async function getRecipe() {
        let temporalRecipes = []
        console.log(fact);

        for (let i = 0; i < fact.length; i++) {
            let id = fact[i]

            await axios.get(process.env.REACT_APP_API_URL + 'post/' + id + "?userId=" + idUserToComment,
            ).then((response) => {
                const recipeData = response.data.post;
                const idRecipe = "" + recipeData.id + ""
                setRecipe(recipeData)
                DownloadFile(recipeData.image_recipe)
                temporalRecipes = [...temporalRecipes, recipeData]
                console.log("TR ", temporalRecipes);

            })
                .catch((error) => {
                    console.error(error);
                });
        }
        setRecipes(temporalRecipes)

        console.log(temporalRecipes);


    }

    useEffect(() => {
        if (fact !== null) {
            getRecipe()
        }

    }, [fact])

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

    return (
        <>
            <Grid item container xs={12} minHeight={"100%"} py={2} px={2}>
                {openRecipe && (
                    <Grid item container spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'} >
                        <PostShowRecipes
                            id={openRecipe}
                            onClose={setOpenRecipe}
                        />
                    </Grid>
                )}
                {(
                    <Grid item container spacing={2} justifyContent={{ xs: 'center', md: 'space-evenly' }} alignContent={'center'} display={openRecipe ? "none" : "flex"}>
                        {recipes.length > 0 ? (
                            recipes.map((record, index) => (
                                <Grid item key={index} xs={12} md={7} style={{ width: '100%' }}>
                                    <PostComponent
                                        onClick={setOpenRecipe}
                                        avatar={record.avatar}
                                        title={record.recipe_name}
                                        postPhoto={record.postPhoto && record.postPhoto == "" ? record.postPhoto : "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505"}
                                        userName={record.userName}
                                        isLiked={record.isLiked}
                                        description={record.description}
                                        publishDate={record.publishDate}
                                        postId={record.id}
                                        likesCounter={record.likes}
                                    />
                                </Grid>
                            ))
                        ) : (<Grid item container xs={12} justifyContent={"center"} alignContent={"center"}>
                            <CircularProgress />
                        </Grid>
                        )}
                    </Grid>
                )}

            </Grid>
        </>

        // <div className='btnBlueRP'>
        //     {/* <Button type="primary" shape="round" onClick={onFinish}> Recomendar </Button> */}
        // <script src="../../../../../ServerIA/data_procesator.py"></script>
        // </div>
    )



}

export default Prueba