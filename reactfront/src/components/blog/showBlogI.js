import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Grid, List, ListItem, ListItemText, Button, Card } from '@mui/material';

const PostDetails = ({ postId, onClose }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch post details when component mounts
    axios.get(process.env.REACT_APP_API_URL + 'post/' + postId)
      .then(response => {
        setPostDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [postId]);
  if (loading) {
    return <CircularProgress />;
  }

  if (!postDetails) {
    return <Typography>No details available.</Typography>;
  }

  return (
    <Grid container style={{
      position: 'fixed',    // Fixed position to overlay
      top: "10dvh",               // Align to top
      left: 0,              // Align to left
      width: '100vw',        // Full width
      overflow: "hidden",
      backgroundColor: '#fff',
      height: '80dvh',
      zIndex: 1000,         // High z-index to overlay everything
      overflowY: 'auto',    // Allow scrolling within the overlay
    }}>

      <Grid item xs={12}>
        <Typography variant="h4" style={{ color: 'white' }}>{postDetails.recipe_name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <img src={postDetails.image_recipe} alt={postDetails.recipe_name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ color: 'white' }}>{postDetails.description}</Typography>
      </Grid>
      <Grid item container xs={12} textAlign={"left"} style={{ color: 'white' }}>
        {/* Additional details with white text color */}
        <Grid item xs={6} >
          <Typography variant="body2">Tiempo de preparación: </Typography>
        </Grid>
        <Grid item xs={6} >
          <Typography variant="body2">{postDetails.preparation_time}</Typography>
        </Grid>
        {/* ... other details ... */}
      </Grid>

      <Grid item xs={12} style={{ height: "400px", overflowY: "auto" }}>
        <Card style={{ padding: "16px", height: "100%", overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>Ingredientes:</Typography>
          <List>
            {postDetails.Ingredients.map((ingredient, index) => (
              <ListItem key={index} style={{ textAlign: 'center' }}>
                <ListItemText primary={ingredient.ingredient} />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Button onClick={() => onClose(false)} variant="contained" color="primary">
          Atras
        </Button>
      </Grid>
    </Grid>
  );
};

export default PostDetails;
