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
    const [roleSource, setRoleSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRight, setCurrentRight] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState()

    useEffect(() => {
        const fetchData = async () => {
            let result = await reqRole()
            setRoleSource(result)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            let result = await reqMeauList()
            setRightList(result)
        }
        fetchData()
    }, [])


    const deleteMethod = (item) => {
        confirm({
            title: '你确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                setRoleSource(roleSource.filter(data => data.id !== item.id))
                delRole(item.id)
            },
            onCancel() {
            },
        });
    }

    const showModal = (item) => {
        setIsModalVisible(true)
        setCurrentRight(item.rights)
        setCurrentId(item.id)
    }

    const handleOk = () => {
        setIsModalVisible(false)
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
        setIsModalVisible(false)
    }

    const onCheck = (checkedKeys) => {
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
