import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, notification } from 'antd'
import { reqAllNews, patchNews } from '../../api'



export default function Audit() {
    const [dataSourse, setDataSourse] = useState([])
    const { username, region } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        const fetchData = async () => {
            let data = await reqAllNews()
            setDataSourse(data.roleId === 1 ? data : [
                ...data.filter(item => item.author === username),
                ...data.filter(item => item.region === region && item.roleId === 3)
            ])
        }
        fetchData()
    }, [username, region])

    const handleAudit = (item, auditState, publishState) => {
        setDataSourse(dataSourse.filter(data => data.id !== item.id))
        const data = {
            auditState,
            publishState,
        }
        patchNews(item.id, data)
        notification.info({
            message: `通知`,
            description:
                `您可以到【审核管理/审核列表】中查看审核状态`,
            placement: "bottomRight",
        });
    }

    const columns = [
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
            title: '审核',
            align: 'center',
            width: '30%',
            render: (item) => {
                return <div>
                    <Button type="primary" style={{ marginRight: '10px' }} onClick={() => handleAudit(item, 2, 1)} >通过</Button>
                    <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
                </div>
            }
        },
    ];
    return (
        <Table
            dataSource={dataSourse}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowKey={(item) => item.id}
        />
    )
}
