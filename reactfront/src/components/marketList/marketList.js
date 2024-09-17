import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Grid } from '@mui/material';

import {
    Form,
    Table,
    Button,
    Card,
    Spin,
    Select,
    Popconfirm,
    message,
    notification,
    checkbox,
    Modal,
}  from 'antd';

import './marketList.css';

export default function Profile() {

    const navigate = useNavigate(); 

    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [listData, setListData] = useState([])
    const [FavoritesData, setFavoritesData] = useState([])
    const [selectData, setSelectData] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        getMarketList();
        getFavorites()
    },[]);

    function getMarketList() {
        axios.get(process.env.REACT_APP_API_URL + 'marketList/lists/'  + cookies.id)
        .then((response) => {
            const listResponse = response.data
            const List = listResponse.map((e) => {
                return {
                    key: e.id,
                    list_title: e.list_title
                }
            })
            setListData(List)
            setLoading(false)
        })
        .catch((error) => {
            console.log(error)
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
            setFavoritesData(FavoritesRes)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    function deleteList(id) {
        
        axios.delete(process.env.REACT_APP_API_URL + 'listItems/' + id)
            .then((response) => {
                deleteMarklist(id)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    function deleteMarklist(id) {
        axios.delete(process.env.REACT_APP_API_URL + 'marketList/'  + id)
        .then((response) => {
            getMarketList()
            notification.success({
                message: 'Lista Eliminada'
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    function onFinish(values) {

        const recipe = FavoritesData.find(({recipeId}) => recipeId === values.listFav).recipe;  
   
        const marketList = {
            list_title: recipe.recipe_name,
            userId: cookies.id 
        }

        axios.post(process.env.REACT_APP_API_URL + 'marketList/', marketList)
        .then((response) => {
            const listId = response.data.id
            setItemList(listId , recipe.Ingredients)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    function setItemList(listId , items) {

        var itemList = []
        
        for (let index = 0; index < items.length; index++) {

            var newElement = {
                mListId: listId,
                ingredient: items[index].ingredient
            } 

            itemList.push(newElement) 
        }

        axios.post(process.env.REACT_APP_API_URL + 'listItems/', itemList)
            .then((response) => {
                notification.success({
                    message: 'Lista añadida con exito'
                });
                handleCancel()
                getMarketList()
            })
            .catch((error) => {
                console.log(error)
            });
    }

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    const navTo = () => {
        navigate("/private/newlist");
    }

    function navToEdit(id){
        navigate("/private/editlist/" + id);
    }

    const columns = [
        {
          title: 'Name',
          dataIndex: 'list_title',
          key: 'list_title',
          render(text,row) {
            return (
                <Link to={'/private/viewlist/'+ row.key} relative='route' >
                <text>{text}</text>
                </Link>
            );
          }
        },
        {
        title: "Action",
        key: "action",
        render(row){
            return(
                <div className='button-table-list'>
                    <div>
                        <Button type="default"  onClickCapture={() => navToEdit(row.key)}><EditOutlined/></Button>     
                    </div>
                    <div>
                        <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => deleteList(row.key)}
                        >
                        <Button style={{marginLeft: 5}} type="dashed" danger><DeleteOutlined/></Button> 
                        </Popconfirm>    
                    </div>        
                 </div>
            );
        }
        }
      ];

    ///Modal booleans
    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <React.Fragment>
        <Grid
        container
        spacing={1}
        xs={12}
        justifyContent={{ xs: "center", md: "space-evenly" }}
        alignContent={"center"}
        >
        <Grid item width={"100%"} md={9}>
        <div className='div-general-list'>
        <Card
        className='div-form-general-recipe-post'
        size='default'
        title={'Lista de compras'}> 
        <Table 
            columns={columns}
            dataSource={listData}
            showHeader={false}
        ></Table>
        <div className='half-width-slot-profile-btnRP'>
            <div className='btnBlueRP'>
                <Button type="primary" onClick={navTo}><PlusOutlined/>Nueva Lista</Button>     
            </div> 
            <div>
                <Button type="primary" onClick={showModal}><PlusOutlined/>Favoritos</Button>
            </div>      
        </div>
        </Card>
        
        <Modal title="Select" 
        open={isModalOpen} footer={false} onCancel={handleCancel}
        width={"50%"}
        >
            <Form
            name='select'
            onFinish={onFinish}
            >
                <Form.Item
                name={'listFav'}
                >
                    <Select 
                    showSearch 
                    optionFilterProp="label"
                    options={selectData} />
                </Form.Item>
                <Form.Item>
                    <div className='half-width-slot-profile-btn'>
                    <div className='btnBlue'>
                        <Button  type="primary" htmlType="submit"> Crear </Button>
                    </div>
                    <div>
                        <Button danger type="primary" onClick={handleCancel}> cancelar </Button>
                    </div>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
        </div>
        </Grid>
        </Grid>
        </React.Fragment>
    );
}

