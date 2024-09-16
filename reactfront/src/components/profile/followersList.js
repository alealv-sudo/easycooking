import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import FollowButton from './followButton';

export default function FollowersList({route , userId, isUser}) {
  
  const [cookies] = useCookies(['userToken']);
  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(null);
  const [loading, setLoading] = useState(false);

  const URL = isUser ? process.env.REACT_APP_API_URL + route + '/paginatedUser?page=' + page + "&userId=" + userId + "&userCurrent=" + cookies.id : process.env.REACT_APP_API_URL + route + '/paginated?page=' + page + "&userId=" + userId

  useEffect(() => {
    loadMore();  // Initial load
  }, []);

  // Load more posts function
  const loadMore = () => {
    if ((maxPage == null || maxPage >= page) && !loading) {
      setLoading(true);
      axios.get(URL)
        .then((response) => {
          const recipeData = response.data;
          
          //console.log(page, [...data, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]); setPage((prevPage) => prevPage + 1);
          setData((prevRecipes) => [...prevRecipes, ...(recipeData?.posts?.length > 0 ? recipeData.posts : [])]);
          setPage((prevPage) => prevPage + 1);
          setMaxPage(recipeData?.totalPages ? recipeData.totalPages : page)
          setLoading(false);  // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);  // Stop loading even if there's an error
        });
    }
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMore}
        hasMore={maxPage >= page}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.user.email}>
              <List.Item.Meta
                avatar={<Avatar />}
                title={<Link relative="path" reloadDocument to={'/private/user/' + item.user.id} >{item.user.userName}</Link>}
                description={item.user.email}
              />
              {console.log(item.user.id)}
              {String(item.user.id) !== String(cookies.id) ? (
                <FollowButton isFollow={item.isFollow} idData={item.id} idUser={item.user.id}></FollowButton>
              ) : (
                <></>
              )}
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
  
};

