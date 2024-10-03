import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCookies } from "react-cookie";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router-dom";

export default function SearchByUserName() {
    const { id } = useParams();


    const URL = id ? `${process.env.REACT_APP_API_URL}profile/usersByName/${id}` : null;

    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        if (id) {
            getUsers();
        }
    }, [id]);

    const getUsers = () => {
        axios.get(URL)
            .then((response) => {
                // console.log("response", response.data);
                setUsersData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
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
            <Divider/>
            <InfiniteScroll
                dataLength={usersData.length}
                loader={
                    <Skeleton
                        avatar
                        paragraph={{ rows: 1 }}
                        active
                    />
                }
                endMessage={<Divider plain>Llegaste al final de la busqueda🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={usersData}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                avatar={<Avatar />}
                                title={<Link to={`/private/user/${item.id}`}>{item.name} {item.lastName}</Link>}
                                description={item.biografia || 'No biography available'}
                            />
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
}
