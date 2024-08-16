import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UnorderedListOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { List, Space, Card, Button, Modal, Form, Select, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function ListDay({favSelect, favorites, userId, day}) {

  const [listData, setListData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getListCalendar()  
  },[]);

  function getListCalendar() {
    axios.get(process.env.REACT_APP_API_URL + 'calendar/list/'  + userId + '/daylist/' + day)
    .then((response) => {
        const dataList = response.data
        console.log(dataList);
        setListData(dataList)
    })
    .catch((error) => {
        console.log(error)
    });
  }

  function onFinish(values) {

    const recipe = favorites.find(({id}) => id === values.listFav).recipe;  
    console.log(recipe)

    const newCalendar = {
        day: day,
        userId: userId, 
        recipeId: recipe.id
    }

    axios.post(process.env.REACT_APP_API_URL + 'calendar/', newCalendar)
    .then((response) => {
        const listId = response.data
        console.log(listId);
        
        getListCalendar()
        handleCancel()
    })
    .catch((error) => {
        console.log(error)
    });

  }

  ///Modal booleans
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const arrayRecipe = Array.from(listData).map((e) => (e.recipe)) 
  console.log(arrayRecipe);
    
  const data = Array.from(arrayRecipe).map((e , i) => (     
    {
      idList: listData[i].id,
      title: <Link to={'/private/postShowRecipe/' + e.id} relative='route'>{e.recipe_name}</Link>,
      description: <br></br>,
      content: <Link to={'/private/postShowRecipe/' + e.id} relative='route'>{e.description}</Link>,
  }));

  return (
    <React.Fragment>

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
                options={favSelect} />
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

    <Card>
    <List
        itemLayout="vertical"
        size="small"

        dataSource={data}
        footer={false}

        renderItem={(item) => (
        <List.Item
            key={item.title}
            actions={[
              <div className='button-table-list'>
              <div>
                  <Button type="default" ><UnorderedListOutlined/></Button>     
              </div>
              <div>
                  <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  okText="Yes"
                  cancelText="No"
                  
                  >
                  <Button style={{marginLeft: 5}} type="dashed" danger><DeleteOutlined/></Button> 
                  </Popconfirm>    
              </div>        
           </div>
            ]}
            extra={
            <img
                width={272}
                alt="logo"
                src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,300"
            />
            }
        >
            <List.Item.Meta
            title={item.title}
            description={item.description}
            />
            {item.content}
        </List.Item>
        )}
    />
    <div className='half-width-slot-profile-btnRP'>
            <div>
                <Button type="primary" onClick={showModal}><PlusOutlined/>Favoritos</Button>
            </div>      
        </div>
    </Card>

    </React.Fragment>
  )  
};
