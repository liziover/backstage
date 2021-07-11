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
    // 将meauList的数据保存在状态中
    const [rightSource, setRightSource] = useState([])

    // 挂载meauList
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
                // 判断选中项的菜单级别
                if (item.grade === 1) {
                    // 在状态中更新页面菜单数据
                    setRightSource(rightSource.filter(data => data.id !== item.id))
                    // 后端同步
                    delRight(item.id)
                } else {
                    // 筛选出对应的父级菜单项
                    let list = rightSource.filter(data => data.id === item.rightId)
                    // 删除指定项
                    list[0].children = list[0].children.filter(data => data.id !== item.id)
                    // 在状态中更新菜单项数据
                    setRightSource([...rightSource])
                    // 后端同步
                    delChildren(item.id)
                }
            },
            onCancel() {
            },
        });
    }

    // 配置项开关的回调
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

    // 列信息
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
