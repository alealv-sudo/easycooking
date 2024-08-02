import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import {
    Table,
    Button,
    Card,
    Spin,
    Space,
    Popconfirm,
    message,
    notification,
    checkbox,
}  from 'antd';

import './marketList.css';

export default function Profile() {

    const navigate = useNavigate(); 

    const [cookies, setCookie] = useCookies(['userToken']);

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [listData, setListData] = useState([])

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        getMarketList();
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

    return (
        <React.Fragment>
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
        </div>
        </Card>
        </div>
        </React.Fragment>
    );
}

