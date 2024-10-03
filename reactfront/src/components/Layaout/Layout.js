import React, { useState } from "react";
//layout Component
import { Layout, theme } from "antd";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  AddCircleOutline as CreatePostIcon,
  AccountCircle as AccountCircleIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
// import {ArrowBackIcon} from '@mui/icons-material/ArrowBack';
import "./Layout.css";
import TodayIcon from "@mui/icons-material/Today";
import ChecklistIcon from "@mui/icons-material/Checklist";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import {
  alpha,
  Button,
  Grid,
  Icon,
  IconButton,
  Input,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  styled,
  TextField,
  Divider,
  Select,
  FormControl
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import BookIcon from "@mui/icons-material/Book";
import { Outlet, useNavigate, redirect } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import { useAuthContext } from "../contexts/authContext";
const { Header, Content } = Layout;

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

const LayoutFront = (props) => {
  const { logout } = useAuthContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleLogout = () => {
    logout();
  };

  const handleHome = () => {
    navigate("/private/blog");
  };

  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate("/private/post");
  };

  const handleClose = () => {
    setAnchorElpost(null);
  };

  const handlePrevieusPage = () => {
    navigate(-1);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElpost, setAnchorElpost] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
  };

  const handleClickPost = (event) => {
    setAnchorElpost(anchorElpost == null ? event.currentTarget : null);
  };

  const navigateAncloseMenu = (data) => {
    setAnchorEl(null);
    if (data !== "") navigate(data);
  };

  const navigateAncloseMenuPost = (data) => {
    setAnchorElpost(null);
    if (data !== "") navigate(data);
  };

  const open = Boolean(anchorEl);
  const openpost = Boolean(anchorElpost);

  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("Usuario");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleChangeFilter = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSearch = () => {
   
    if (filterValue === "Usuario") {
      navigate("/private/seacrhByUserName/" + searchText, { replace: true, reloadDocument: true});
    } else if (filterValue === "Receta") {
      navigate("/private/seacrhByRecipesName/" + searchText, { replace: true, reloadDocument: true});
    } else if (filterValue === "Post") {
      navigate("/private/seacrhByPostName/" + searchText, { replace: true, reloadDocument: true});
    } else if (filterValue === "Review") {
      navigate("/private/seacrhByReviewName/" + searchText, { replace: true, reloadDocument: true});
    }
  };

  const [valueSelect, setValueSelect] = useState("")
  const navToRecipe = (value) => {
    if (value.target.value !== "none") {
       setValueSelect(value.target.value)
        const newUrl = "/private/showrecipe/" + value.target.value;
        window.location.href = newUrl;
    }else{
      setValueSelect("")
      navigate("/private/blog/");
    }
  }

  return (
    <Layout>
      <Layout>
        <Header className="siteHeader" color={colorBgContainer}>
          <Grid
            container
            justifyContent={"space-evenly"}
            height={"100%"}
            alignContent={"center"}
          >
            <Grid item xs={1}>
              <IconButton
                sx={{ p: "10px", color: "white" }}
                className="color-icon"
              >
                <Icon>
                  <img
                    src="/EasyLogo512.jpg"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Icon>
              </IconButton>
            </Grid>
            <Grid item container xs={9} justifyContent={"center"}>
            <Grid item xs={9} display={"flex"} alignContent={"baseline"} justifyContent={"center"}>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  bgcolor: "transparent", // Background transparent
                  border: "1px solid white", // White outline
                  boxShadow: "none", // Remove default shadow
                  color: "white",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1, color: "white" }} // Text color white
                  placeholder="Buscar..."
                  inputProps={{ "aria-label": "buscador" }}
                  value={searchText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <IconButton
                  sx={{ p: "10px", color: "white" }} // Icon color white
                  aria-label="search"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>

                <Select
                  labelId="filter-select-label"
                  id="filter-select"
                  value={filterValue}
                  onChange={handleChangeFilter}
                  startAdornment={<FilterAltIcon />}
                  label="Filter"
                  sx={{ color: "white" }} // Text color white
                  renderValue={() => null}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        "& .Mui-selected": {
                          backgroundColor: "rgba(0, 0, 255, 0.2)", // Highlight color
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 255, 0.3)", // Hover color
                          },
                        },
                        "& .Mui-selected.Mui-focusVisible": {
                          backgroundColor: "rgba(0, 0, 255, 0.2)", // Maintain highlight color when focused
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="Usuario">Usuario</MenuItem>
                  <MenuItem value="Receta">Receta</MenuItem>
                  <MenuItem value="Post">Post</MenuItem>
                  <MenuItem value="Review">Review</MenuItem>
                </Select>
              </Paper>
              <FormControl sx={{ m: 1, minWidth: 100, alignContent: "center", justifyContent:"center"}} size="small">
                <Select
                  value={valueSelect}
                  onChange={navToRecipe}
                  sx={{bgcolor: "whitesmoke"}}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>Tipos</em>
                  </MenuItem>
                  <MenuItem name={"ASADOS"} value={"ASADOS"}>Asados</MenuItem>
                  <MenuItem name={"BEBIDAS"} value={"BEBIDAS"}>Bebidas</MenuItem>
                  <MenuItem name={"COCTELES"} value={"COCTELES"}>Cocktails</MenuItem>
                  <MenuItem name={"ENSALADAS"} value={"ENSALADAS"}>Ensaladas</MenuItem>
                  <MenuItem name={"FITNESS"} value={"FITNESS"}>Fitness</MenuItem>
                  <MenuItem name={"GUISOS"} value={"GUISOS"}>Guisos</MenuItem>
                  <MenuItem name={"COMIDA"} value={"COMIDA"}>Platillos</MenuItem>
                  <MenuItem name={"POSTRES"} value={"POSTRES"}>Postres</MenuItem>
                  <MenuItem name={"SALSAS"} value={"SALSAS"}>Salsas</MenuItem>
                  <MenuItem name={"SNACKS"} value={"SNACKS"}>Snacks</MenuItem>
                  <MenuItem name={"SOPAS"} value={"SOPAS"}>Sopas</MenuItem>
                  <MenuItem name={"VEGANA/VEGETARIANA"} value={"VEGANA/VEGETARIANA"}>Venganas</MenuItem>
                </Select>
              </FormControl>
              </Grid>
            </Grid>
            <Grid item container xs={1} justifyContent={"flex-end"}>
              <div>
                <IconButton
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                    padding: "8px",
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  }}
                >
                  <MenuIcon style={{ color: "black" }} />
                </IconButton>
                <StyledMenu
                  disableRipple
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => navigateAncloseMenu("")}
                >
                  <MenuItem
                    onClick={() => navigateAncloseMenu("/private/profile")}
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <AccountCircleIcon />
                    Mi perfil
                  </MenuItem>
                  <Divider />

                  <MenuItem
                    onClick={() => navigateAncloseMenu("/private/marketlist")}
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <ChecklistIcon />
                    Lista de compras
                  </MenuItem>
                  <MenuItem
                    onClick={() => navigateAncloseMenu("/private/calendar")}
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <TodayIcon />
                    Dieta
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigateAncloseMenu("/private/recipesAdministrator")
                    }
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <BookIcon />
                    Mis Publicaciones
                  </MenuItem>
                  {/* <MenuItem
                    onClick={() =>
                      navigateAncloseMenu("/private/recipesFiltered")
                    }
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <SearchIcon />
                    IngrediSearch
                  </MenuItem> */}
                  <MenuItem
                    onClick={() =>
                      navigateAncloseMenu("/private/recomendations")
                    }
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <LocalFireDepartmentIcon />
                    Recomendaciones
                  </MenuItem>

                  <Divider />
                  <MenuItem
                    onClick={() => navigateAncloseMenu("/private/logout")}
                    disableRipple
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <LogoutIcon />
                    Logout
                  </MenuItem>
                </StyledMenu>
              </div>
            </Grid>
          </Grid>
        </Header>
        <Content
          style={{
            margin: "10dvh 0",
            overflow: "hidden",
            height: "80dvh",
          }}
        >
          <Content
            style={{
              overflowY: "auto",
              height: "100%",
            }}
          >
            <Outlet />
          </Content>
        </Content>
        <Footer
          className="siteFooter"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          <Grid
            container
            justifyContent={"space-evenly"}
            height={"100%"}
            alignContent={"center"}
          >
            <Grid xs={3}>
              <IconButton
                onClick={handlePrevieusPage}
                className="color-buuton"
                style={{ backgroundColor: "white" }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>

            <Grid xs={3}>
              <IconButton
                onClick={handleClickPost}
                className="color-buuton"
                style={{ backgroundColor: "white" }}
              >
                <CreatePostIcon />
              </IconButton>
              <Menu
                disableRipple
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorElpost}
                open={Boolean(anchorElpost)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <MenuItem
                  onClick={() => navigateAncloseMenuPost("/private/post")}
                  disableRipple
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <CreatePostIcon />
                  Nueva Receta
                </MenuItem>
                <MenuItem
                  onClick={() => navigateAncloseMenuPost("/private/gpost")}
                  disableRipple
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <CreatePostIcon />
                  Nueva Publicación
                </MenuItem>
                <MenuItem
                  onClick={() => navigateAncloseMenuPost("/private/newreview")}
                  disableRipple
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <CreatePostIcon />
                  Nueva Reseña
                </MenuItem>
              </Menu>
            </Grid>

            <Grid xs={3}>
              <IconButton
                onClick={handleHome}
                className="color-buuton"
                style={{ backgroundColor: "white" }}
              >
                <HomeIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutFront;
