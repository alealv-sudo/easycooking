import axios from 'axios'
import React, { useState, useEffect, message } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { MinusCircleOutlined ,PlusOutlined } from '@ant-design/icons';

import {
    Typography,
    Upload,
    Form,
    Input,
    Space,
    Select,
    Button,
    Tag,
    notification
} from 'antd';

import countriesData from '../recipes/countries.json';
import './recipePost.css';

const folderID = "1v-Q_3LzdTfinD3bq51YaWg0VA1vymj1b"

const customizeRequiredMark = (label, { required }) => (
    <>
      {required ? <Tag color="error">Req</Tag> : ""}
      {label}
    </>
);

const Publicar = () => {
    const [cookies, setCookie] = useCookies(['userToken']);

    const [imgFileList, setFileList] = useState([]);

    const [isDisabledTemp, setIsDisabledTemp] = useState(false);
    const [isDisabledCalories, setIsDisabledCalories] = useState(false);

    const [countries, setCountries] = useState([]);
    const [isImage, setIsimage] = useState(false);
    
    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

    const { fileList } = state;

    const navigate = useNavigate();

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

    const  changeboleantrue = () => {
        setIsimage(true)
    }

    const  changeboleanfalse = () => {
        setIsimage(false)
    }

    const setIngredients = (id_recipe ,ingredientValue) => {

        var ingredientsData = []
        
        for (let index = 0; index < ingredientValue.length; index++) {

            var newElement = {
                recipeId: id_recipe,
                ingredient: ingredientValue[index].ingredientes
            } 

            ingredientsData.push(newElement) 
        }

        axios.post(process.env.REACT_APP_API_URL + 'ingredients/', ingredientsData)
        .then(function response(response) {
           
        })
        .catch(function error(error) {
            console.log(error);
        })

    }

    const onFinish = (values) => {
           
        if (isImage && fileList.length !== 0) {
            const recipes = {
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
        
            axios.post(process.env.REACT_APP_API_URL + 'post/', recipes)
                .then(function response(response) {
                    setIngredients(response.data.id, values.ingredients)
                    handleUpload(response.data.id);
                    
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

    const handleFileSubmit = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const updateIMG = (recipe_id, img_id) => {

        //put 
        const ImageRecipes = {
            image_recipe: img_id,
            recipe_id: recipe_id,
        }

        axios.put(process.env.REACT_APP_API_URL + 'post/', ImageRecipes)
            .then(function response(response) {
                notification.success({
                    message: 'Receta creado con exito'
                });
            })
            .catch(function error(error) {
                console.log(error);
            })

        Salir();
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
                updateIMG(recipe_id, res.data);
            })
            .catch((error) => {
                console.error(error);
                setState({
                    uploading: false,
                });
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


    const handleCheckboxChange = (e) => {
        console.log(e.target.name)
        if (e.target.name === "N_A_Temp") {
            setIsDisabledTemp(e.target.checked);
        }
        else if (e.target.name === "N_A_Calories") {
            setIsDisabledCalories(e.target.checked);
        }
        else {
            console.log("Unknow error in handleCheckboxChange")
        }
    };

    useEffect(() => {
        setCountries(countriesData);
    }, []);


    const Salir = () => {
        navigate("/private/blog");
    }

    return (
        <React.Fragment>
            <Typography.Title level={2}>Nueva Receta</Typography.Title>

            <div className='div-general-recipe-post'>
                {/* Form Receta */}
                <Form
                    className='div-form-general-recipe-post'
                    layout="vertical"
                    name="recipe"
                    
                    requiredMark={customizeRequiredMark}
                    onFinish={onFinish}
                    autoComplete="off"
                >
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

                    {/* Input Titulo */}
                    <Form.Item
                        className="half-width-slot"
                        label="Titulo"
                        name="recipe_name"
                        normalize={value => (value || '').toUpperCase()}
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
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
                                rules={[{ required: true, message: 'Campo obligatorio' }]}
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
                                rules={[{ required: false, message: 'Campo obligatorio' }]}
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
                                rules={[{ required: false, message: 'Campo obligatorio' }]}
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
                        rules={[{ required: false, message: 'Campo obligatorio' }]}
                    >
                        <Input.TextArea
                            className="colors-bg"
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            disabled={false}
                        />
                    </Form.Item>

                    {/* Input Ingredientes */}
                    <label className="label-ingedient">Ingredient</label>
                    
                    <div type="flex" justify="center" align="middle">
                    <Form.List 
                    name="ingredients"
                    rules={[

                        {
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
                                name={[name, 'ingredientes']}
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
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                    >
                        <Input.TextArea
                            className="colors-bg"
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            disabled={false}
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
                                rules={[{ required: true, message: 'Campo obligatorio' }]}
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

                                label="País de origen"
                                name="originary"
                                normalize={value => (value || '').toUpperCase()}
                                rules={[{ required: true, message: 'Campo obligatorio' }]}
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
                                <Button type="primary" shape="round" htmlType="submit"> Publicar </Button>     
                            </div>
                            <div>
                                <Button danger type="primary" shape="round" onClick={Salir}> Cancelar </Button>
                            </div>
                        </div>
                    </Form.Item>

                </Form>
            </div>                       
            
        </React.Fragment>
    );

}

export default Publicar