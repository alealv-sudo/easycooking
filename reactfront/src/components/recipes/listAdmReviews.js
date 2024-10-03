import React, { useEffect, useState } from "react";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    List,
    Space,
    Button,
    Popconfirm,
    Spin,
} from "antd";


export default function ListDay({ userId }) {

    const [isLoading, setIsLoadin] = useState(true)
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getListCalendar();
    }, []);

    async function getListCalendar() {
        axios
            .get(
                process.env.REACT_APP_API_URL +
                "reviewPost/user/" +
                userId
            )
            .then((response) => {
                const dataList = response.data;
                setDatalist(dataList);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function setDatalist(dataMa) {
        const arrayRecipe = Array.from(dataMa);
        console.log("recipe", arrayRecipe);

        let urlOb = [];

        for (let index = 0; index < dataMa.length; index++) {
            const e = dataMa[index];
            console.log("e", e);

            let res;

            urlOb.push(res);
        }



        const dataM = Array.from(arrayRecipe).map((e, i) => ({
            idRecipe: e.id,
            idList: dataMa[i].id,
            ImgUrl: urlOb[i],
            title: (
                <Link to={"/private/viewreview/" + e.id} relative="route">
                    {e.title_post}
                </Link>
            ),
            description: <br></br>,
            content: (
                <Link to={"/private/viewreview/" + e.id} relative="route">
                    {e.review_post}
                </Link>
            )
        }));

        setData(dataM);
        setIsLoadin(false);
    }

    function onFinish(values) {
        
    }


    function onDelete(paramsId) {
        axios
            .delete(process.env.REACT_APP_API_URL + "reviewPost/" + paramsId)
            .then((response) => {
                setDatalist([]);
                setData([]);
                getListCalendar();
            })
            .catch((error) => {
                console.log(error);
            });
    }


    if (isLoading) {
        return <div style={{ textAlignLast: "center" }} ><br /><br />
            <Spin color="#000106" tip="Loading..." /></div>;
    }

    return (
        <React.Fragment>

            <List
                onFinish={onFinish}
                itemLayout="vertical"
                size="small"
                dataSource={data}
                footer={false}
                pagination={{pageSize: 4, showSizeChanger: false}}
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        actions={[
                            <div className="button-table-list">
                                <div>
                                    <Popconfirm
                                        title="Editar Reseña"
                                        description="Desa editar esta reseña?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => navigate("/private/editreview/" + item.idRecipe)}
                                    >
                                        <Button type="default">
                                            <EditOutlined />
                                        </Button>
                                    </Popconfirm>
                                </div>
                                
                                <div>
                                    <Popconfirm
                                        title="Eliminar esta Reseña"
                                        description="Estas seguro de eliminar esta reseña?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => onDelete(item.idList)}
                                    >
                                        <Button style={{ marginLeft: 5 }} type="dashed" danger>
                                            <DeleteOutlined />
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>,
                        ]}
                        
                    >
                        <List.Item.Meta
                            title={item.title}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />
        </React.Fragment>
    );
}
