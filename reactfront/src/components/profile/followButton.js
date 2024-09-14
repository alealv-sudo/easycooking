import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useCookies } from 'react-cookie';

import { Button } from "antd";

const FollowButton = ({ idData, idUser, isFollow}) => {

  const [cookies, setCookie] = useCookies(["userToken"]);
  
  const [idColum, setIdColum] = useState(idData)
  const [follow, setFollow] = useState(isFollow);
  const initialText = "Siguiendo";
  const [text, setText] = useState(initialText);

  function followedUser() {

    const followed = {
      userId: cookies.id,
      followedId: idUser,
    }

    axios.post(process.env.REACT_APP_API_URL + 'followeds/', followed)
        .then((response) => {
            const newId = response.data.id;
            setIdColum(newId)
            setFollow(true)
        })
        .catch((error) => {
            console.log(error)
    });
  }


  function unFollow() {

    axios
      .delete(process.env.REACT_APP_API_URL + "followeds/" + idColum)
      .then((response) => {
        setFollow(false);
      })
      .catch((error) => {
        console.log(error);
      });    
  }

  return (
    <>
      {follow ? (
        <Button
          onMouseOver={() => setText("Dejar de seguir")}
          onMouseLeave={() => setText(initialText)}
          onClick={() => unFollow()}
        >
          {text}
        </Button>
      ) : (
        <Button onClick={() => followedUser()}>Seguir</Button>
      )}
    </>
  );
};

export default FollowButton;
