import React, { useState, useEffect } from 'react'
import { Table, Button, Tag, Modal, Popover, Switch } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import { reqMeauList,delRight,delChildren,patchRight,patchChildren } from '../../api'

const { confirm } = Modal;
export default function RightList() {
    const [rightSource, setRightSource] = useState([])

    useEffect(() => {
        const fetch = async () => {
            let result = await reqMeauList()
            let newResult = result.map((item) => {
                if (item.children.length === 0) {
                    item.children = ''
                }
                return item
            })
            setRightSource(newResult)
        }
        fetch()
    }, [])


    const deleteMethod = (item) => {
        confirm({
            title: '你确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                if (item.grade === 1) {
                    setRightSource(rightSource.filter(data => data.id !== item.id))
                    delRight(item.id)
                } else {
                    let list = rightSource.filter(data => data.id === item.rightId)
                    list[0].children = list[0].children.filter(data => data.id !== item.id)
                    setRightSource([...rightSource])
                    delChildren(item.id)
                }
            },
            onCancel() {
            },
        });
    }

    const changeCheckedMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 0 ? 1 : 0
        setRightSource([...rightSource])
        const data = {pagepermisson: item.pagepermisson}
        if (item.grade === 1) {
            patchRight(item.id,data)
        } else {
            patchChildren(item.id,data)
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => { return <span style={{ fontWeight: "700" }}>{id}</span> }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => { return <Tag color="orange">{key}</Tag> }
        },
        {
            title: '操作',
            width: '20%',
            align: 'center',
            render: (item) => {
                return <div>
                    <Button
                        style={{ marginRight: "10px" }}
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteMethod(item)}
                    />
                    <Popover
                        content={
                            <div style={{ textAlign: 'center' }}>
                                <Switch
                                    checked={item.pagepermisson}
                                    onChange={() => changeCheckedMethod(item)}
                                />
                            </div>}
                        title="页面配置项"
                        trigger="focus"
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            disabled={item.pagepermisson === undefined}
                        />
                    </Popover>
                </div>
            }

        },
    ];

    return (
        <div>
            <Table dataSource={rightSource} columns={columns} pagination={{ pageSize: 5 }}/>
        </div>
    )
}
