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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Grid } from '@mui/material';

import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useState } from 'react';
const PostComponent = ({ title, userName, postPhoto, description, likesCounter, publishDate, postId, isLiked, avatar, onClick, showLikesAndFavs,hasImage }) => {
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
    const handleFavsClick = () => {
        const userId = cookies.id;
        axios.post(process.env.REACT_APP_API_URL + 'favorites/fav', {
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
            <Card sx={{ maxHeight: "800px", minWidth: "100%" }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="avatar">
                        </Avatar>
                    }
                    
                    title={title}
                    subheader={publishDate}
                    onClick={() => onClick(postId)} // Add the onClick handler here
                    sx={{
                        cursor: 'pointer' // Set cursor to pointer to indicate clickability
                    }}
                />
                {hasImage && <CardMedia sx={{maxHeight: "350px", cursor: 'pointer' }} onClick={() => onClick(postId)}
                    component="img"
                    image={postPhoto}
                    alt={title}
                />}
                <CardContent sx={{maxHeight: "350px", cursor: 'pointer' }} onClick={() => onClick(postId)}>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
               {showLikesAndFavs && <CardActions disableSpacing>
                    <Grid container justifyContent={"space-between"}>
                        <IconButton aria-label="add to favorites"  onClick={() => handleFavsClick()}>
                            <BookmarkIcon />
                        </IconButton>
                        <IconButton aria-label="add to likes" onClick={() => handleLikeClick()}>
                            {tempLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            {countLikes}
                        </IconButton>
                    </Grid>
                </CardActions>}
            </Card></>
    )
}

export default PostComponent