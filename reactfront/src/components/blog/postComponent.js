import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid } from '@mui/material';

import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useState } from 'react';
const PostComponent = ({ title, userName, postPhoto, description, likesCounter, publishDate, postId, isLiked, avatar, onClick }) => {
    const [tempLiked, setTempLiked] = useState(isLiked)
    const [countLikes, setCountLikes] = useState(likesCounter || 0);
    const [cookies] = useCookies(['userToken']);
    const handleLikeClick = () => {
        const userId = cookies.id;
        axios.post(process.env.REACT_APP_API_URL + 'favorites/like', {
            postId: postId,
            userId: userId
        })
            .then(response => {
                const isLiked1 = response.data.isLiked;
                setCountLikes(prevCount => isLiked1 ? prevCount + 1 : Math.max(prevCount - 1, 0));
                setTempLiked(isLiked1)
            })
            .catch(error => {
                console.error(error);
            });
    };
    return (
        <>
            <Card sx={{ maxHeight: "400px", minWidth: "100%" }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="avatar">
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={title}
                    subheader={publishDate}
                />
                <CardMedia onClick={() => onClick(postId)}
                    component="img"
                    height={{ xs: "150px", md: "1000px" }}
                    image={postPhoto}
                    alt={title}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Grid container justifyContent={"space-between"}>

                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                        <IconButton aria-label="add to favorites" onClick={() => handleLikeClick()}>
                            {tempLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            {countLikes}
                        </IconButton>
                    </Grid>
                </CardActions>
            </Card></>
    )
}

export default PostComponent