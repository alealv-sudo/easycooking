import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import { CloseOutlined } from '@ant-design/icons';

import {
    Typography,
    Card,
    Input,
    Form,
    Button,
    Space,
    Spin
} from 'antd';

export default function Profile() {
    const [cookies, setCookie] = useCookies(['userToken']);
    const [isLoading, setLoading] = useState(true);

    const [form] = Form.useForm();

    /*Get User / Obtener datos de usuario y perfil*/

    useEffect(() => {
        setLoading(false)
    },[]);

    function setMarketList() {
        axios.put(process.env.REACT_APP_API_URL + 'post/user/'  + cookies.id)
        .then((response) => {
            console.log("Data Recipes", response.data);
        })
        .catch((error) => {
            console.log(error)
        });
    }
    
    function setItemList() {
        axios.get(process.env.REACT_APP_API_URL + 'user/'  + cookies.id)
            .then((response) => {
              console.log(response.data); 
               
            })
            .catch((error) => {
                console.log(error)
            });
    }

    if (isLoading) {
        return <div style={{textAlignLast:"center" }} ><br/><br/>
            <Spin color="#000106" tip="Loading..."/></div>;
    }

    return (
        <React.Fragment>
        <Typography.Title level={2}>Nueva Lista</Typography.Title>
        
        <Form
        labelCol={{
            span: 6,
        }}
        wrapperCol={{
            span: 18,
        }}
        form={form}
        name="dynamic_form_complex"
        style={{
            maxWidth: 600,
        }}
        autoComplete="off"
        initialValues={{
            items: [{}],
        }}
        >
        <Form.List name="items">
            {(fields, { add, remove }) => (
            <div
                style={{
                display: 'flex',
                rowGap: 16,
                flexDirection: 'column',
                }}
            >
                {fields.map((field) => (
                <Card
                    size="small"
                    title={`Item ${field.name + 1}`}
                    key={field.key}
                    extra={
                    <CloseOutlined
                        onClick={() => {
                        remove(field.name);
                        }}
                    />
                    }
                >
                    <Form.Item label="Name" name={[field.name, 'name']}>
                    <Input />
                    </Form.Item>

                    {/* Nest Form.List */}
                    <Form.Item label="List">
                    <Form.List name={[field.name, 'list']}>
                        {(subFields, subOpt) => (
                        <div
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 16,
                            }}
                        >
                            {subFields.map((subField) => (
                            <Space key={subField.key}>
                                <Form.Item noStyle name={[subField.name, 'first']}>
                                <Input placeholder="first" />
                                </Form.Item>
                                <Form.Item noStyle name={[subField.name, 'second']}>
                                <Input placeholder="second" />
                                </Form.Item>
                                <CloseOutlined
                                onClick={() => {
                                    subOpt.remove(subField.name);
                                }}
                                />
                            </Space>
                            ))}
                            <Button type="dashed" onClick={() => subOpt.add()} block>
                            + Add Sub Item
                            </Button>
                        </div>
                        )}
                    </Form.List>
                    </Form.Item>
                </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                + Add Item
                </Button>
            </div>
            )}
        </Form.List>

        </Form>
        </React.Fragment>
    );
}

