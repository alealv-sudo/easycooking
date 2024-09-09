import React, { useEffect, useState } from "react";

import {
    Button,
} from 'antd';

const FollowButton = ({ id, isFollow }) => {

    const initialText =  "Siguiendo"
    const [text, setText] = useState(initialText)
    
    return (
        <>
            {isFollow ? (
                <Button 
                onMouseOver={() => setText("Dejar de seguir")}
                onMouseLeave={() => setText(initialText)}
                >
                {text}
                </Button>
            ) : (
                <Button>Seguir</Button>
            )}
        </>
    );
}

export default FollowButton;
