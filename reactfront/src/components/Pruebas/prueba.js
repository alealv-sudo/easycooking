
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Image } from 'antd'

const URI = 'http://localhost:8000/blogs/'

const Prueba = () => {

    const [recipe, setRecipe] = useState([]);

    useEffect(() => {
        getRecipe()
    }, [])

    const getRecipe = async () => {
        const res = await axios.get(process.env.REACT_APP_API_URL + 'post/'+ "3")
        
        // Datos binarios de la imagen
        const imageBinaryData = res.data.image_recipe.data; 
        // Convierte los datos binarios en una URL base64
        const base64String = btoa(String.fromCharCode(...imageBinaryData));
        const imageBase64Url = `data:image/jpeg;base64,${base64String}`;

        res.data.image_recipe = imageBase64Url

        setRecipe(res.data)
        console.log(res.data)
    }
    

    return (
        // <div>
        //    <p>Esto es la prueba</p>
        // </div>


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
            
            
        >
            <Form.Item>
                <img src={recipe.image_recipe} />
            </Form.Item>
        </Form>
            
    )
}

export default Prueba