import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Modal, notification } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
} from '@ant-design/icons'
import { reqNewsDraft,delNews,patchNews } from '../../api'

const { confirm } = Modal;
export default function NewsDraft(props) {
    const [dataSourse, setdataSourse] = useState([])

    const { username } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        const fetchData = async () => {
            let data = await reqNewsDraft(username)
            setdataSourse(data)
        }
        fetchData()
    }, [username])

    const deleteMethod = (item) => {
        confirm({
            title: '你确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                setdataSourse(dataSourse.filter(data => {
                    return data.id !== item.id
                }))
                delNews(item.id)
            },
            onCancel() {
            },
        });
    }

    const updateMethod = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }

    const subMethod = (item) => {
        const data = {
            auditState: 1
        }
        patchNews(item.id,data)
        props.history.push('/audit-manage/list')
        notification.info({
            message: `通知`,
            description:
                `您可以到${"审核列表"}中查看`,
            placement: "bottomRight",
        });
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <div style={{ fontWeight: "700" }}>{id}</div>
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            align: 'center',
            width: '30%',
            render: (item) => {
                return <div>
                    <Button shape='circle' danger icon={<DeleteOutlined />} onClick={() => deleteMethod(item)}></Button>
                    <Button shape='circle' type='primary' icon={<EditOutlined />} style={{ margin: "0 10px" }} onClick={() => updateMethod(item)}></Button>
                    <Button shape='circle' type='primary' icon={<UploadOutlined />} onClick={() => subMethod(item)}></Button>
                </div>
            }
        },
    ];
    return (
        <div>
            <Table
                dataSource={dataSourse}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={(item) => item.id}
            />
        </div>
    )
}
