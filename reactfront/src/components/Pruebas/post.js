import axios from 'axios'
import React, { useState, useEffect, message } from 'react'
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

const Publicar = () => {
    const [cookies, setCookie] = useCookies(['userToken']);

    const [recipe, setRecipe] = useState([]);
    const [imgFileList, setFileList] = useState([]);

    const [isDisabledTemp, setIsDisabledTemp] = useState(false);
    const [isDisabledCalories, setIsDisabledCalories] = useState(false);

    const [countries, setCountries] = useState([]);

    const [state, setState] = useState({
        fileList: [],
        uploading: false,
    });

 const { fileList } = state;

  const props = {
    onRemove: (file) => {
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

    const onFinish = (values) => {
        
        const recipes = {
            recipe_name:        values.recipe_name,
            preparation_time:   values.preparation_time,
            temperature:        values.temperature,
            calories:           values.calories,
            description:        values.description,
            ingredients:        values.ingredients,
            preparation:        values.preparation,
            type_recipe:        values.type_recipe,
            originary:          values.originary,
            tips:               values.tips,

            creator_code:       cookies.id,
        }

        axios.post(process.env.REACT_APP_API_URL + 'post/', recipes)
            .then(function response(response) {
                console.log("data", response.data);
                handleUpload();  
            })
            .catch(function error(error) {
                console.log(error);
            })
    }

    const handleFileSubmit = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleUpload = () => {
        const { fileList } = state;
        const formData = new FormData();
    
        fileList.forEach((file) => {
          formData.append("myFiles", file, '-' + file.name);
        });
    
        axios.post(process.env.REACT_APP_API_URL + "google/upload/", formData)
          .then(res => {
    
            console.log("ID", res);
            setState({
              fileList: [],
            });
            
            message.success("Archivo subido con exito.");
            //put 
         })
          .catch((error) => {
            //console.error(error);
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


            {/* Input imagen */}
            <div type="flex" justify="center" align="middle">
                    <Form.Item
                        className="half-width-slot"
                        justify="center" align="middle"

                        label="Imagen de la Receta"
                        name="image_recipe"
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
                            {fileList != null && (fileList.length < 1 && '+ Upload')}

                        </Upload>

                    </Form.Item>
            </div>

            {/* Form Receta */}
            <Form
                layout="vertical"
                requiredMark={true}
                name="recipe"
                initialValues={{

                    // id:                  recipe.id,
                    // recipe_name:         recipe.name,
                    // preparation_time:    recipe.preparation_time,
                    // temperature:         recipe.temperature,
                    // calories:            recipe.calories,
                    // description:         recipe.description,
                    // ingredients:         recipe.ingredients,
                    // preparation:         recipe.preparation,
                    // type_recipe:         recipe.type_recipe,
                    // originary:           recipe.originary,
                    // tips:                recipe.tips,
                    // image_recipe:        recipe.image_recipe,

                    // creator_code:        user.code,
                    // CreatedAt:
                    // updatedAt:

                }}
                onFinish={onFinish}
                autoComplete="off"
            >

                {/* Input Titulo */}
                <Form.Item
                    className="half-width-slot"
                    label="Nombre de la Receta"
                    name="recipe_name"
                    normalize={value => (value || '').toUpperCase()}
                    //rules={[{ required: true, message: 'Por favor introduce el numbre de la receta.' }]}
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
                            //rules={[{ required: true, message: 'Por favor introduce el tiempo de preparacion de la receta.' }]}
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
                    //rules={[{ required: true, message: 'Por favor introduce los ingredientes de la receta.' }]}
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
                    //rules={[{ required: true, message: 'Por favor introduce la preparacion de la receta.' }]}
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
                            //rules={[{ required: true, message: 'Por favor introduce un tipo de receta.' }]}
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
                            //rules={[{ required: true, message: 'Por favor introduce un Lugar de origen de la receta.' }]}
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
                    <Button type="primary" shape="round" htmlType="submit"> Publicar </Button>
                </Form.Item>

            </Form>
        </React.Fragment>
    );

}

export default Publicar