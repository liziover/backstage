import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import {
    DeleteOutlined,
    UnorderedListOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import { reqRole, reqMeauList,delRole,patchRole} from '../../api'

const { confirm } = Modal;
export default function RoleList() {
    // 将角色列表数据保存到状态中
    const [roleSource, setRoleSource] = useState([])
    // 保存所有操作权限菜单项到状态中
    const [rightList, setRightList] = useState([])
    // 将各个角色中的权限菜单保存到状态中
    const [currentRight, setCurrentRight] = useState([])
    // Modal展开、隐藏的状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 将当前选中项的 Id 保存到状态中
    const [currentId, setCurrentId] = useState()

    // 获取角色类别、权限数据
    useEffect(() => {
        const fetchData = async () => {
            let result = await reqRole()
            setRoleSource(result)
        }
        fetchData()
    }, [])

    // 获取权限列表数据
    useEffect(() => {
        const fetchData = async () => {
            let result = await reqMeauList()
            setRightList(result)
        }
        fetchData()
    }, [])


    // 删除选项的回调
    const deleteMethod = (item) => {
        confirm({
            title: '你确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // 更新状态
                setRoleSource(roleSource.filter(data => data.id !== item.id))
                // 后端同步
                delRole(item.id)
            },
            onCancel() {
            },
        });
    }

    const showModal = (item) => {
        // 展示Modal组件
        setIsModalVisible(true)
        // 将当前操作项中的权限列表保存在状态中
        setCurrentRight(item.rights)
        // 将当前操作项的id保存在状态中
        setCurrentId(item.id)
    }

    // 
    const handleOk = () => {
         // 隐藏Modal组件
        setIsModalVisible(false)
        // 
        setRoleSource(roleSource.map(item => {
            if(item.id === currentId ){
               return  {
                   ...item,
                   rights:currentRight
                }
            }
            return item
        }))
        const data = {rights:currentRight}
        patchRole(currentId,data)
    }   

    const handleCancel = () => {
        // 隐藏Modal组件
        setIsModalVisible(false)
    }

    const onCheck = (checkedKeys) => {
        // 更新权限数据状态的中的值
        setCurrentRight(checkedKeys.checked)
      };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <div style={{ fontWeight: "700" }}>{id}</div>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            align: 'center',
            width: '20%',
            render: (item) => {
                return <div>
                    <Button shape='circle' danger style={{ marginRight: "10px" }} icon={<DeleteOutlined />} onClick={() => deleteMethod(item)}></Button>
                    <Button shape='circle' type='primary' icon={<UnorderedListOutlined />} onClick={() => showModal(item)}></Button>
                    <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Tree
                            checkable
                            checkedKeys={currentRight}
                            treeData={rightList}
                            checkStrictly
                            onCheck={onCheck}
                        />
                    </Modal>
                </div>
            }
        },
    ];
    return (
        <div>
            <Table
                dataSource={roleSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={item => item.id} />
        </div>
    )
}
