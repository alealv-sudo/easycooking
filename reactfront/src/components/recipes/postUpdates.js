import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MinusCircleOutlined ,PlusOutlined } from '@ant-design/icons';

import {
    Typography,
    Upload,
    Form,
    Input,
    Space,
    Spin,
    Select,
    Button,
    notification,
    message,
} from 'antd';

import countriesData from '../recipes/countries.json';
import './recipePost.css';

const folderID = "1v-Q_3LzdTfinD3bq51YaWg0VA1vymj1b"

const IDRECIPE = "6"

const UpdateRecipes = () => {

    const [cookies, setCookie] = useCookies(['userToken']);

    const [imgFileList, setFileList] = useState([]);

    const [countries, setCountries] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isImage, setIsimage] = useState(false);

    const [recipe, setRecipe] = useState('');

    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

    const { fileList } = state;

    const navigate = useNavigate();

    function getRecipe() {
        axios.get(process.env.REACT_APP_API_URL + 'post/' + IDRECIPE,
        ).then((response) => {
            const recipeData = response.data;
            console.log("Data", recipeData);
            setRecipe(recipeData)
            DownloadFile(recipeData.image_recipe)
            
        })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getRecipe();
        setCountries(countriesData);
    }, [])

    const Salir = () => {
        navigate("/private/blog");
    }

    /* Peticiones BD */

    const setIngredients = (id_recipe ,ingredientValue) => {

        var ingredientsData = []
        
        for (let index = 0; index < ingredientValue.length; index++) {

            var newElement = {
                recipeId: id_recipe,
                ingredient: ingredientValue[index].ingredient
            } 

            ingredientsData.push(newElement) 
        }

        console.log("Ingredients data", ingredientValue);
        axios.post(process.env.REACT_APP_API_URL + 'ingredients/', ingredientsData)
        .then(function response(response) {
           
        })
        .catch(function error(error) {
            console.log(error);
        })

    }

    const deleteIngredients = (id_recipe, ingredients) => {

        axios.delete(process.env.REACT_APP_API_URL + 'ingredients/'+ id_recipe)
        .then(function response(response) {
            setIngredients(id_recipe, ingredients)
        })
        .catch(function error(error) {
            console.log(error);
        })

    }

    const onFinish = (values) => {
           
        if (fileList.length !== 0) {
            const recipes = {
                recipe_id: recipe.id,
                recipe_name: values.recipe_name,
                preparation_time: values.preparation_time,
                temperature: values.temperature,
                calories: values.calories,
                description: values.description,
                preparation: values.preparation,
                type_recipe: values.type_recipe,
                originary: values.originary,
                tips: values.tips,
        
                creatorId: cookies.id,
            }
        
            axios.put(process.env.REACT_APP_API_URL + 'post/', recipes)
                .then(function response(response) {
                    deleteIngredients(recipe.id, values.ingredients)
                    if(isImage && fileList.length !== 0){
                        handleUpload(recipe.id);
                    }else{
                        notification.success({
                            message: 'Receta editada con exito'
                        });
                    } 
            })
            .catch(function error(error) {
                    console.log(error);
            })
        }else{
            notification.error({
                message: 'Foto Obligatoria'
            });
        }

    }

    const updateIMG = (recipe_id, img_id) => {

        //put 
        const ImageRecipes = {
            image_recipe: img_id,
            recipe_id: recipe_id,
        }

        axios.put(process.env.REACT_APP_API_URL + 'post/', ImageRecipes)
            .then(function response(response) {
                notification.success({
                    message: 'Receta editada con exito'
                });
            })
            .catch(function error(error) {
                console.log(error);
            })

        Salir();
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

    const handleFileSubmit = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };


    const deleteImage = (image_recipe_id) => {
        axios.delete(process.env.REACT_APP_API_URL + "google/delete/" + image_recipe_id)
            .then((response) => {

            })
            .catch((error) => {

            })
    }

    const handleUpload = (recipe_id) => {
        const { fileList } = state;
        const formData = new FormData();

        fileList.forEach((file) => {
            formData.append("myFiles", file, '-' + file.name);
        });

        formData.append("folderId", folderID);

        axios.post(process.env.REACT_APP_API_URL + "google/upload/", formData)
            .then(res => {
                deleteImage(recipe.image_recipe)
                updateIMG(recipe_id, res.data);
            })
            .catch((error) => {
                console.error(error);
                setState({
                    uploading: false,
                });
            });

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

    /* Funciones Extras */

    const  changeboleantrue = () => {
        setIsimage(true)
    }

    const  changeboleanfalse = () => {
        setIsimage(false)
    }

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    return (
        <React.Fragment>
            <Typography.Title level={2}>Publicar</Typography.Title>
            {/* Form Receta */}

            <div className='div-general-recipe-post'>
            <Form
                layout="vertical"
                className='div-form-general-recipe-post'
                requiredMark={false}
                name="recipes"
                onFinish={onFinish}
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
                            {...props}
                            listType="picture-card"
                            fileList={imgFileList}
                            onChange={handleFileSubmit}
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
                        disabled={false}
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
                                disabled={false}
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
                                disabled={false}
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
                            rules={[{ required: false, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                        >
                            <Input
                                placeholder="Cantidad de Calorias"
                                type="number"
                                min="0"
                                // disabled={isDisabledCalories}
                                disabled={false}
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
                    rules={[{ required: false, message: 'Por favor introduce una descripcion para la receta.' }]}
                >
                    <Input.TextArea
                        className="colors-bg"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        disabled={false}
                    />
                </Form.Item>

                 {/* Input Ingredientes */}
                 <label className="label-ingedient">Ingredientes</label>
                    
                <div type="flex" justify="center" align="middle">
                <Form.List 
                name="ingredients"
                rules={[{
                    validator: async (_, names) => {
                        if (!names || names.length < 2) {
                            return Promise.reject(new Error('Requerido Minimo 2 ingredientes'));
                        }
                        },
                    },
                    ]}
                >
                {(fields, { add, remove } , { errors }) => (
                    <>
                    {fields.map(({ key, name, ...restField } ) => (
                        <div
                        key={key}
                        className='item-form-list'
                        >
                        <Form.Item
                            style={{
                                width: '100%',
                                marginRight: 4,
                            }}
                            {...restField}
                            name={[name, 'ingredient']}
                            rules={[
                            {
                                required: true,
                                message: 'Missing ingredient',
                            },
                            ]}
                        >
                            <Input  placeholder="ingredient" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                        </div>
                    ))}
                    <Form.Item
                    style={{
                        width: '60%'
                    }}
                    >
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add field
                    </Button>
                    <Form.ErrorList errors={errors} />
                    </Form.Item>                    
                    </>       
                )}
                </Form.List>
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
                        disabled={false}
                    />
                </Form.Item>

                <div type="flex" justify="center" align="middle">
                    <Space>
                        {/* Input Tipo */}
                        <Form.Item
                            className="half-width-slot"
                            type="flex" justify="center" align="middle"

                            label="Tipo de receta"
                            name="type_recipe"
                            normalize={value => (value || '').toUpperCase()}
                            rules={[{ required: true, message: 'Por favor introduce un tipo de receta.' }]}
                        >
                            <Select
                                disabled={false}
                                showSearch
                            >
                                <Select.Option value="Comida">Comida</Select.Option>
                                <Select.Option value="Bebida">Bebida</Select.Option>
                                <Select.Option value="Postre">Postre</Select.Option>
                            </Select>
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
                            rules={[{ required: true, message: 'Por favor introduce un Lugar de origen de la receta.' }]}
                        >
                            <Select
                                disabled={false}
                                showSearch
                            >
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
                        disabled={false}
                    />
                </Form.Item>

                {/* Boton Submit */}
                <Form.Item
                    className="my-form-container"
                >
                    <div className='half-width-slot-profile-btnRP'>
                        <div className='btnBlueRP'>
                            <Button type="primary" shape="round" htmlType="submit"> Editar </Button>     
                        </div>
                        <div>
                            <Button danger type="primary" shape="round" > Cancelar </Button>
                        </div>
                    </div>
                </Form.Item>

            </Form>
        </div>
        </React.Fragment>
    );

}

export default UpdateRecipes