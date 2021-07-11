import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Tag, notification } from 'antd'
import { reqNewsList, patchNews } from '../../api'


export default function AuditList(props) {
    const [dataSourse, setDataSourse] = useState([])

    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const fetchData = async () => {
            let data = await reqNewsList(username)
            setDataSourse(data)
        }
        fetchData()
    }, [username])

    const handlePublish = (item) => {
        const data = {
            "publishState": 2,
            "publishTime": Date.now()
        }
        patchNews(item.id, data)
        props.history.push('/publish-manage/published')
        notification.info({
            message: `通知`,
            description:
                `您可以到【发布管理/已发布】中查看`,
            placement: "bottomRight",
        });
    }

    // 撤销的回调
    const handleRervert = (item) => {
        // 更新页面
        setDataSourse(dataSourse.filter(data => data.id !== item.id))
        const data = {
            auditState: 0
        }
        // 后端同步
        patchNews(item.id, data)
        notification.info({
            message: `通知`,
            description:
                `您可以到草稿箱中查看`,
            placement: "bottomRight",
        });
    }

    // 更新的回调
    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["", "orange", "green", "red"]
                const auditType = ["草稿箱", "审核中", "已通过", "未通过"]
                return <Tag color={colorList[auditState]}>{auditType[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            align: 'center',
            width: '30%',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button danger onClick={() => handleRervert(item)}>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button type="primary" onClick={() => handlePublish(item)}>发布</Button>
                    }
                    {
                        item.auditState === 3 && <Button onClick={() => handleUpdate(item)}>更新</Button>
                    }
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