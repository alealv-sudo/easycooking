import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { RollbackOutlined } from "@ant-design/icons";

import ListDay from "./listDay.js";

import { Tabs, Spin, Card, Button } from "antd";

import "./marketList.css";

export default function RecipeCalendar() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["userToken"]);

  const [isLoading, setLoading] = useState(true);
  const [userID, setUserID] = useState(cookies.id);
  const [FavoritesData, setFavoritesData] = useState([]);
  const [selectData, setSelectData] = useState([]);

  /*Get User / Obtener datos de usuario y perfil*/

  useEffect(() => {
    getFavorites();
  }, []);

  function getFavorites() {
    axios
      .get(process.env.REACT_APP_API_URL + "favorites/alluser/" + cookies.id)
      .then((response) => {
        const FavoritesRes = response.data;

        const favData = FavoritesRes.map((e) => {
          return {
            value: e.recipe.id,
            label: e.recipe.recipe_name,
          };
        });
        setLoading(false);
        setSelectData(favData);
        setFavoritesData(FavoritesRes);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const navTo = () => {
    navigate("/private/blog");
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

  const data = [
    {
      label: "LUNES",
      key: "LUNES",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"LUNES"}
        />
      ),
      forceRender: true,
    },
    {
      label: "MARTES",
      key: "MARTES",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"MARTES"}
        />
      ),
      forceRender: true,
    },
    {
      label: "MIERCOLES",
      key: "MIERCOLES",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"MIERCOLES"}
        />
      ),
      forceRender: true,
    },
    {
      label: "JUEVES",
      key: "JUEVES",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"JUEVES"}
        />
      ),
      forceRender: true,
    },
    {
      label: "VIERNES",
      key: "VIERNES",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"VIERNES"}
        />
      ),
      forceRender: true,
    },
    {
      label: "SABADO",
      key: "SABADO",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"SABADO"}
        />
      ),
      forceRender: true,
    },
    {
      label: "DOMINGO",
      key: "DOMINGO",
      children: (
        <ListDay
          favSelect={selectData}
          favorites={FavoritesData}
          userId={userID}
          day={"DOMINGO"}
        />
      ),
      forceRender: true,
    },
  ];

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
          <div className="div-general-calendar">
            <Card className="div-tab-calendar">
              <Tabs size="large" type="card" centered items={data} />
            </Card>
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
