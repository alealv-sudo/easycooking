import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Grid } from "@mui/material";
import { RollbackOutlined } from "@ant-design/icons";

import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { notification, Card, Input, Form, Button, Spin } from "antd";

import "./marketList.css";

export default function EditListMarket() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cookies, setCookie] = useCookies(["userToken"]);
  const [isLoading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);

  const [form] = Form.useForm();

  /*Get User / Obtener datos de usuario y perfil*/

  useEffect(() => {
    getList();
  }, []);

  function getList() {
    axios
      .get(process.env.REACT_APP_API_URL + "marketList/" + id)
      .then((response) => {
        const listResponse = response.data;
        setListData(listResponse);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onFinish(values) {
    const marketList = {
      list_title: values.name,
      id: listData.id,
    };

    axios
      .put(process.env.REACT_APP_API_URL + "marketList/", marketList)
      .then((response) => {
        deleteItemList(listData.id, values.items);
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
          message: "Lista editada con exito",
        });
        navTo();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteItemList(listId, items) {
    axios
      .delete(process.env.REACT_APP_API_URL + "listItems/" + listId)
      .then((response) => {
        setItemList(listId, items);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const navTo = () => {
    navigate("/private/marketlist");
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
      <Grid
        container
        spacing={1}
        xs={12}
        justifyContent={{ xs: "center", md: "space-evenly" }}
        alignContent={"center"}
      >
        <Grid item width={"100%"} md={9}>
          <div className="bottom-page-nav">
            <div className="buttom-div-nav">
              <Button
                type="default"
                size="large"
                style={{
                  fontSize: "20px",
                  height: "50px",
                  width: "90px",
                }}
                onClick={() => navTo()}
              >
                <RollbackOutlined />
              </Button>
            </div>
          </div>
          <div className="div-general-list">
            <Form
              onFinish={onFinish}
              className="div-form-general-recipe-post"
              layout="vertical"
              form={form}
              name="dynamic_form_complex"
              autoComplete="off"
              initialValues={{
                name: listData.list_title,
                items: listData.listitems,
              }}
            >
              <Card size="default" title={"Editar Lista"}>
                {/* Input Ingredientes */}
                <div type="flex" justify="center" align="middle">
                  <Form.Item
                    style={{
                      width: "85%",
                    }}
                    name={"name"}
                    label="Nombre"
                    rules={[{ required: true, message: "Campo obligatorio" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.List
                    name="items"
                    rules={[
                      {
                        validator: async (_, names) => {
                          if (!names || names.length < 2) {
                            return Promise.reject(
                              new Error("Requerido Minimo 2 ingredientes")
                            );
                          }
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="item-form-list-input">
                            <Form.Item
                              style={{
                                width: "80%",
                                marginRight: 6,
                              }}
                              {...restField}
                              name={[name, "ingredient"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing ingredient",
                                },
                              ]}
                            >
                              <Input placeholder="ingredient" />
                            </Form.Item>
                            <CloseOutlined onClick={() => remove(name)} />
                          </div>
                        ))}
                        <Form.Item
                          style={{
                            width: "85%",
                          }}
                        >
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Nuevo Ingrediente
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>

                <Form.Item className="my-form-container">
                  <div className="half-width-slot-profile-btnRP">
                    <div className="btnBlueRP">
                      <Button type="primary" shape="round" htmlType="submit">
                        {" "}
                        Editar{" "}
                      </Button>
                    </div>
                    <div>
                      <Button
                        danger
                        type="primary"
                        shape="round"
                        onClick={navTo}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Card>
            </Form>
          </div>
          <div className="bottom-page-nav">
            <div className="buttom-div-nav">
              <Button
                type="default"
                size="large"
                style={{
                  fontSize: "20px",
                  height: "50px",
                  width: "90px",
                }}
                onClick={() => navTo()}
              >
                <RollbackOutlined />
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
