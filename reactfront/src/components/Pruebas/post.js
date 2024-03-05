import axios from 'axios'
import React, { useState, useEffect } from 'react'

import {
    Typography,
    Upload,
    Form,
    Input,
    Space,
    Checkbox,
    Select
} from 'antd';

import countriesData from './countries.json';

const URI = 'http://localhost:8000/blogs/'

const Publicar = () => {

    const [recipe, setRecipe] = useState([]);
    const [fileList, setFileList] = useState([]);

    const [isDisabledTemp, setIsDisabledTemp] = useState(false);
    const [isDisabledCalories, setIsDisabledCalories] = useState(false);

    const [countries, setCountries] = useState([]);


    const handleFileSubmit = ({ fileList: newFileList }) => {
        // Actualiza el estado con la lista de archivos seleccionados
        setFileList(newFileList);
        //setImageURL(info.file.response.url);
        // console.log('Archivos seleccionados:', newFileList);
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




    return (
        <React.Fragment>
            <Typography.Title level={2}>Publicar</Typography.Title>

            {/* Form Receta */}
            <Form
                layout="vertical"
                requiredMark={true}
                name="recipe"
                initialValues={{
                    // code: user.code,

                    // recipeID:           recipe.ID,
                    // name:               recipe.name,
                    // picture:            recipe.picture,
                    // type_s:             recipe.type_s,
                    // originary:          recipe.originary,
                    // preparation_time:   recipe.preparation_time,
                    // ingredients:        recipe.ingredients,
                    // preparation_mode:   recipe.preparation_mode,
                    // tips_notes:         recipe.tips_notes,
                }}
            //    onFinish={onFinish}
            >

                {/* Input imagen */}
                <div type="flex" justify="center" align="middle">
                    <Form.Item
                        className="half-width-slot"
                        justify="center" align="middle"

                        label="Imagen de la Receta"
                        name="uploadImage"
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
                            normalize={value => (value || '').toUpperCase()}
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

                            label="Temp Preparacion0"
                            name="preparation_Temp"
                            normalize={value => (value || '').toUpperCase()}
                            rules={[{ required: false, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                        >

                            <Input
                                placeholder="Temperatura en °C"
                                type="number"
                                min="" step="10"

                                disabled={isDisabledTemp}
                            />
                            <Checkbox type="checkbox" label="N/A" name="N_A_Temp" onChange={handleCheckboxChange}
                            >
                                N/A
                            </Checkbox>


                        </Form.Item>
                    </Space>
                    {/* Input Calorias */}
                    <Space>
                        <Form.Item
                            className="half-width-slot"
                            type="flex" justify="center" align="middle"

                            label="Calorias"
                            name="calories"
                            normalize={value => (value || '').toUpperCase()}
                            rules={[{ required: false, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
                        >
                            <Input
                                placeholder="Cantidad de Calorias"
                                type="number"
                                min="0"
                                disabled={isDisabledCalories}
                            />
                            <Checkbox type="checkbox" label="N/A" name="N_A_Calories" onChange={handleCheckboxChange}
                            >
                                N/A
                            </Checkbox>

                        </Form.Item>
                    </Space>
                </div>

                {/* Input Descripcion */}
                <Form.Item
                    className="half-width-slot"
                    label="Descripcion de receta"
                    name="description"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: false, message: 'Por favor introduce una descripcion para la receta.' }]}
                >
                    <Input.TextArea
                        className="colors-bg"
                        rows={4}
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Ingredientes */}
                <Form.Item
                    className="half-width-slot"

                    label="Ingredientes de la receta"
                    name="ingredients"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce los ingredientes de la receta.' }]}
                >
                    <Input.TextArea
                        className="colors-bg"
                        rows={4}
                        disabled={false}
                    />
                </Form.Item>

                {/* Input Metodo de Preparacion */}
                <Form.Item
                    className="half-width-slot"
                    label="Preparacion de la receta"
                    name="preparation_mode"
                    normalize={value => (value || '').toUpperCase()}
                    rules={[{ required: true, message: 'Por favor introduce la preparacion de la receta.' }]}
                >
                    <Input.TextArea
                        className="colors-bg"
                        rows={4}
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
                            name="type_s"
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
                    name="tips_notes"
                    normalize={value => (value || '').toUpperCase()}
                >
                    <Input.TextArea
                        className="colors-bg"
                        rows={4}
                        disabled={false}
                    />
                </Form.Item>

            </Form>
        </React.Fragment>
    );

}

export default Publicar