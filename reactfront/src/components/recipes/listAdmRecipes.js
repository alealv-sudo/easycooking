import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UnorderedListOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { List, notification, Button, Popconfirm, Image, Spin } from "antd";

const UrlTem =
  "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505";

export default function ListDay({ userId }) {
  const [isLoading, setIsLoadin] = useState(true);
  const [listData, setListData] = useState([]);
  const [data, setData] = useState([]);
  const [url, setUrl] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getListCalendar();
  }, []);

  async function getListCalendar() {
    axios
      .get(process.env.REACT_APP_API_URL + "post/user/" + userId)
      .then((response) => {
        const dataList = response.data;
        setListData(dataList);
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

      if (e.image_recipe === "1") {
        res = UrlTem;
      } else {
        if (e.image_recipe.length <= 33) {
          let blo = await DownloadFile(e.image_recipe);
          res = window.URL.createObjectURL(blo);
        } else {
          res = e.image_recipe;
        }
      }

      urlOb.push(res);
    }

    const dataM = Array.from(arrayRecipe).map((e, i) => ({
      idRecipe: e.id,
      idList: dataMa[i].id,
      ImgUrl: urlOb[i],
      title: (
        <Link to={"/private/viewRecipe/" + e.id} relative="route">
          {e.recipe_name}
        </Link>
      ),
      description: <br></br>,
      content: (
        <Link to={"/private/viewRecipe/" + e.id} relative="route">
          {e.description}
        </Link>
      ),
    }));

    setData(dataM);
    setIsLoadin(false);
  }

  function onFinish(values) {}

  function onDelete(paramsId) {
    axios
      .delete(process.env.REACT_APP_API_URL + "post/" + paramsId)
      .then((response) => {
        setDatalist([]);
        setData([]);
        getListCalendar();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const DownloadFile = async (image_recipe) => {
    let res = await axios.get(
      process.env.REACT_APP_API_URL + "google/download/" + image_recipe,
      {
        responseType: "blob",
      }
    );
    let data = res.data; //or res
    return data;
  };

  if (isLoading) {
    return (
      <div style={{ textAlignLast: "center" }}>
        <br />
        <br />
        <Spin color="#000106" tip="Loading..." />
      </div>
    );
  }

  return (
    <React.Fragment>
      <List
        onFinish={onFinish}
        itemLayout="vertical"
        size="small"
        dataSource={data}
        footer={false}
        pagination={{ pageSize: 4, showSizeChanger: false }}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <div className="button-table-list">
                <div>
                  <Popconfirm
                    title="Editar Receta"
                    description="Desa editar esta receta?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() =>
                      navigate("/private/postUpdates/" + item.idRecipe)
                    }
                  >
                    <Button type="default">
                      <EditOutlined />
                    </Button>
                  </Popconfirm>
                </div>
                <div>
                  <Popconfirm
                    title="Eliminar esta Receta"
                    description="Estas seguro de eliminar esta receta?"
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
            extra={
              <div>
                <Image width={200} fallback={item.ImgUrl}></Image>
              </div>
            }
          >
            <List.Item.Meta title={item.title} description={item.description} />
            {item.content}
          </List.Item>
        )}
      />
    </React.Fragment>
  );
}
