import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useCookies } from 'react-cookie';

import {
    Typography,
    Upload,
    Form,
    Input,
    Space,
    Checkbox,
    Select,
    Button
} from 'antd';

import countriesData from './countries.json';

const URI = 'http://localhost:8000/blogs/'
const IDRECIPE = "3"

const ShowPostRecipes = () => {

    const [cookies, setCookie] = useCookies(['userToken']);

    const [fileList, setFileList] = useState([]);

    const [countries, setCountries] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [recipe, setRecipe] = useState('');
    

    function getRecipe(){
        axios.get(process.env.REACT_APP_API_URL + 'post/' + IDRECIPE ,
        ).then((response) => {
            const recipeData = response.data;
            setRecipe(recipeData)
            setLoading(false);
        })
        .catch((error) =>{
            console.error(error);
        });
    } 

    useEffect(() => {
        getRecipe();
        setCountries(countriesData);
    },[])
    
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
        // Actualiza el estado con la lista de archivos seleccionados
        setFileList(newFileList);
        //setImageURL(info.file.response.url);
        // console.log('Archivos seleccionados:', newFileList);
    };

    const onFinish = (values) => {
        const recipes = {
            id:                 recipe.id,
            recipe_name:        values.recipe_name,
            image_recipe:       values.image_recipe,
            preparation_time:   values.preparation_time,
            temperature:        values.temperature,
            calories:           values.calories,
            description:        values.description,
            ingredients:        values.ingredients,
            preparation:        values.preparation,
            type_recipe:        values.type_recipe,
            originary:          values.originary,
            tips:               values.tips,
            creator_code:       values.creator_code,
        }

        axios.put(process.env.REACT_APP_API_URL + 'post/', recipes
            )
            .then(function response(response) {
                console.log(response.data);
            })
            .catch(function error(error) {
                console.log(error);
            })
    }

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    return (
        <React.Fragment>
            <Typography.Title level={2}>Publicar</Typography.Title>
            {/* Form Receta */}
            
            <Form
                layout="vertical"
                requiredMark={false}
                name="recipes"
                onFinish={onFinish}
                initialValues={{
                    id:                  recipe.id,
                    recipe_name:         recipe.recipe_name,
                    preparation_time:    recipe.preparation_time,
                    temperature:         recipe.temperature,
                    calories:            recipe.calories,
                    description:         recipe.description,
                    ingredients:         recipe.ingredients,
                    preparation:         recipe.preparation,
                    type_recipe:         recipe.type_recipe,
                    originary:           recipe.originary,
                    tips:                recipe.tips,
                }}
            >
                
                {/* Input imagen */}
                <div type="flex" justify="center" align="middle">
                    <Form.Item
                        className="half-width-slot"
                        justify="center" align="middle"

                        label="Imagen de la Receta"
                        name="image_recipe"
                    >
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleFileSubmit}
                            onPreview={onPreview}
                            beforeUpload={() => false} // Evita la carga automática de la imagen
                        >
                            {fileList.length < 1 && '+ Upload'}

                        </Upload>

                    </Form.Item>
                </div>

                {/* Input Titulo */}
                <Form.Item
                    className="half-width-slot"
                    label="Nombre de la Receta"
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
                    <Space>
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
                    <Space>
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
                    label="Descripcion de receta"
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
                <Form.Item
                    className="half-width-slot"

                    label="Ingredientes de la receta"
                    name="ingredients"
                    normalize={value => (value || '')}
                    rules={[{ required: true, message: 'Por favor introduce los ingredientes de la receta.' }]}
                >
                    <Input.TextArea
                        className="colors-bg"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Metodo de Preparacion */}
                <Form.Item
                    className="half-width-slot"
                    label="Preparacion de la receta"
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

                            label="País de origen"
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
                    className = "my-form-container"
                >
                    <Button type="primary" shape="round" htmlType="submit"> Actualizar </Button>
                </Form.Item>

            </Form>
        </React.Fragment>
    );

}

export default ShowPostRecipes