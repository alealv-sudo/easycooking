import React, { useEffect, useState } from "react";
import axios from "axios";
import { UnorderedListOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  List,
  Space,
  notification,
  Button,
  Modal,
  Form,
  Select,
  Popconfirm,
  Image,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const UrlTem =
  "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505";

export default function ListDay({ favSelect, favorites, userId, day}) {

  const [isLoading, setIsLoadin] = useState(true)
  const [listData, setListData] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState();

  useEffect(() => {
    getListCalendar();
  }, []);

  async function getListCalendar() {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "calendar/list/" +
          userId +
          "/daylist/" +
          day
      )
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
    const arrayRecipe = Array.from(dataMa).map((e) => e.recipe);
    console.log("recipe", arrayRecipe);
    
    let urlOb = [];

    for (let index = 0; index < dataMa.length; index++) {
      const e = dataMa[index].recipe;
      console.log("e", e);

      let res;

      if (e.image_recipe === "1") {
        res = UrlTem;
      } else {
        let blo = await DownloadFile(e.image_recipe);
        res = URL.createObjectURL(blo);
        setUrl(res);
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

  function onFinish(values) {
    const recipe = favorites.find(
      ({ recipeId }) => recipeId === values.listFav
    ).recipe;

    const newCalendar = {
      day: day,
      userId: userId,
      recipeId: recipe.id,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "calendar/", newCalendar)
      .then((response) => {
        const listId = response.data;
        getListCalendar();
        handleCancel();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ///Modal booleans
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function onDelete(paramsId) {
    axios
      .delete(process.env.REACT_APP_API_URL + "calendar/" + paramsId)
      .then((response) => {
        getListCalendar();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onCreateList(params) {
    const recipe = favorites.find(({ recipeId }) => recipeId === params).recipe;

    const marketList = {
      list_title: recipe.recipe_name,
      userId: userId,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "marketList/", marketList)
      .then((response) => {
        const listId = response.data.id;
        setItemList(listId, recipe.Ingredients);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function setItemList(listId, items) {
    var itemList = [];

    for (let index = 0; index < items.length; index++) {
      var newElement = {
        mListId: listId,
        ingredient: items[index].ingredient,
      };

      itemList.push(newElement);
    }

    axios
      .post(process.env.REACT_APP_API_URL + "listItems/", itemList)
      .then((response) => {
        notification.success({
          message: "Lista añadida con exito",
        });
        handleCancel();
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
    return <div style={{textAlignLast:"center" }} ><br/><br/>
        <Spin color="#000106" tip="Loading..."/></div>;
  }

  return (
    <React.Fragment>
      <Modal
        title="Select"
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
        width={"50%"}
      >
        <Form name="select" onFinish={onFinish}>
          <Form.Item name={"listFav"}>
            <Select showSearch optionFilterProp="label" options={favSelect} />
          </Form.Item>
          <Form.Item>
            <div className="half-width-slot-profile-btn">
              <div className="btnBlue">
                <Button type="primary" htmlType="submit">
                  {" "}
                  Crear{" "}
                </Button>
              </div>
              <div>
                <Button danger type="primary" onClick={handleCancel}>
                  {" "}
                  cancelar{" "}
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <List
        itemLayout="vertical"
        size="small"
        dataSource={data}
        footer={false}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <div className="button-table-list">
                <div>
                  <Popconfirm
                    title="Lista De Compras"
                    description="Desa crear una lista de compras?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onCreateList(item.idRecipe)}
                  >
                    <Button type="default">
                      <UnorderedListOutlined />
                    </Button>
                  </Popconfirm>
                </div>
                <div>
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
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
            <List.Item.Meta
              title={item.title}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
      <div className="half-width-slot-profile-btnRP">
        <div>
          <Button type="primary" onClick={showModal}>
            <PlusOutlined />
            Favoritos
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
