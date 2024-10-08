import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { RollbackOutlined } from "@ant-design/icons";

import { Input, Button, Form, Card, Spin, Checkbox, List } from "antd";

import "./marketList.css";
import Item from "antd/es/list/Item";

export default function Profile() {
  const [form] = Form.useForm();

  const { id } = useParams();
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["userToken"]);

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [listData, setListData] = useState();

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

  function setCheckbox(values) {
    const list = form.getFieldValue();
    const value = list.items[values];

    axios
      .put(process.env.REACT_APP_API_URL + "listItems/", value)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (isLoading) {
    return (
      <div style={{ textAlignLast: "center" }}>
        <br />
        <br />
        <Spin color="#000106" tip="Loading..." />
      </div>
    );
  }

  const navTo = () => {
    navigate("/private/marketlist");
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
        <div className="all-page">

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
              form={form}
              className="div-form-general-recipe-post"
              layout="vertical"
              name="dynamic_form_complex"
              autoComplete="off"
              initialValues={{
                name: listData.list_title,
                items: listData.listitems,
              }}
            >
              <Card size="default" title={listData.list_title}>
                {/* Input Ingredientes */}
                <div type="flex" justify="center" align="middle">
                  <Form.List name="items">
                    {(fields) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="item-form-list-input">
                            <Form.Item
                              style={{
                                marginRight: 5,
                              }}
                              {...restField}
                              valuePropName={"checked"}
                              name={[name, "checked"]}
                            >
                              <Checkbox
                                onChange={() => setCheckbox(key)}
                              ></Checkbox>
                            </Form.Item>
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
                              <Input disabled={true} placeholder="ingredient" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "id"]}
                              hidden={true}
                            >
                              <Input disabled={true} />
                            </Form.Item>
                          </div>
                        ))}
                      </>
                    )}
                  </Form.List>
                </div>

                <Form.Item className="my-form-container">
                  <div className="half-width-slot-profile-btnRP">
                    <div>
                      <Button
                        danger
                        type="primary"
                        shape="default"
                        onClick={navTo}
                      >
                        {" "}
                        Salir{" "}
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
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
