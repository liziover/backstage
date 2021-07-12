import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import { reqUser, reqRegion, reqRole, delUser, patchUser, postNewUser } from '../../api'
import UserForm from '../../components/userForm/UserForm'
import { roleType } from '../../config/roleType'

const { confirm } = Modal;

export default function User() {
    const [userList, setUserList] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [regionList, setregionList] = useState([])
    const [roleList, setroleList] = useState([])
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [addUserEnd, setaddUserEnd] = useState()
    const [updateCurrent, setupdateCurrent] = useState()
    const addForm = useRef(null)
    const updateForm = useRef(null)

    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const fetchData = async () => {
            let list = await reqUser()
            setUserList(roleType[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleType[item.roleId] === "editor")
            ])
        }
        fetchData()
    }, [roleId, region, username])

    useEffect(() => {
        const fetchData = async () => {
            let result = await reqRegion()
            setregionList(result)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            let result = await reqRole()
            setroleList(result)
        }
        fetchData()
    }, [])

    const deleteMethod = (item) => {
        confirm({
            title: '你确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                setUserList(userList.filter(data => data.id !== item.id))
                delUser(item.id)
            },
            onCancel() {
            },
        });
    }

    // 修改 user 的配置信息
    const updateUserInFo = (item) => {
        setTimeout(() => {
            setisUpdateVisible(true)
            if (item.roleId === 1) {
                setisUpdateDisabled(true)
            } else {
                setisUpdateDisabled(false)
            }
            updateForm.current.setFieldsValue(item)
        })
        setupdateCurrent(item)
    }

    const changeRoleState = (item) => {
        item.roleState = !item.roleState
        setUserList([...userList])
        const data = {
            roleState: item.roleState
        }
        patchUser(item.id, data)
    }

    const addUserMethod = () => {
        setisAddVisible(true)
    }

    const addFormOk = () => {
        addForm.current.validateFields()
            .then(value => {
                setisAddVisible(false)
                addForm.current.resetFields()
                const data = {
                    ...value,
                    "roleState": true,
                    "default": false,
                }
                postNewUser(data).then(res => {
                    setUserList([...userList, {
                        ...res,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }])
                })
            })
        setaddUserEnd(false)
    }

    const updateFormOk = () => {
        updateForm.current.validateFields()
            .then(value => {
                setisUpdateVisible(false)
                setUserList(userList.map(item => {
                    if (item.id === updateCurrent.id) {
                        return {
                            ...item,
                            ...value,
                            role: roleList.filter(item => item.id === value.roleId)[0]
                        }
                    }
                    return item
                }))
                setisUpdateDisabled(!isUpdateDisabled)
                patchUser(updateCurrent.id, value)
            })
    }

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => {
                    return {
                        text: item.title,
                        value: item.value
                    }
                }),
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter: (value, item) => item.region === value,
            render: (region) => {
                return <div style={{ fontWeight: "700" }}>{region === "" ? "全球" : region}</div>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => { return role.roleName }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => { return <Switch checked={roleState} disabled={item.default} onChange={() => changeRoleState(item)} /> }
        },
        {
            title: '操作',
            align: 'center',
            width: '20%',
            render: (item) => {
                return <div>
                    <Button shape='circle' danger style={{ marginRight: "10px" }} disabled={item.default} icon={<DeleteOutlined />} onClick={() => deleteMethod(item)}></Button>
                    <Button shape='circle' type='primary' disabled={item.default} icon={<EditOutlined />} onClick={() => updateUserInFo(item)}></Button>
                </div>
            }
        },
    ];
    return (
        <div>
            <Button style={{ marginBottom: '10px' }} type='primary' onClick={() => addUserMethod()}>添加用户</Button>
            <Table
                dataSource={userList}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={item => item.id}
            />
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => { setisAddVisible(false) }}
                onOk={() => addFormOk()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} addUserEnd={addUserEnd} />
            </Modal>
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOk()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true} />
            </Modal>
        </div >
    )
}
