import React from 'react'
import { Table } from 'antd'
import { Link } from 'react-router-dom'

export default function PublishManage(props) {
    const columns = [
        {
            title: '新闻标题',
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
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category?.title
            }
        },
        {
            title: '操作',
            align: 'center',
            width: '20%',
            render: (item) => {
                return <div>{ props.button(item.id)}</div>
            }
        },
    ];
    return (
        <Table
            dataSource={props.dataSource}
            columns={columns}
            pagination={{ pageSize: 6 }}
            rowKey={item => item.id}
        />
    )
}
