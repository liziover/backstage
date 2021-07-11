import React, { forwardRef, useState,useEffect } from 'react'
import { Form, Select, Input } from 'antd'
import {roleType} from '../../config/roleType'

const { Option } = Select;
const NewUserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)

    // 
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])

    // 每次添加完新用户后，接触选择超级管理员后region框的禁用状态
    useEffect(() => {
        setisDisabled(props.addUserEnd)
    }, [props.addUserEnd])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))

    // 区域框
    const checkRegionDisabled = (item) => {
        //判断当前操作时更新用户配置还是添加新的用户
        if (props.isUpdate) {
            // 判断当前登陆用户是否是超级管理员
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            // 判断当前登陆用户是否是超级管理员
            // 判断当前登陆用户是否是超级管理员
            if (roleId === 1) {
                return false
            } else {
                return item.value !== region
            }
        }
    }

    // 角色
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            // 判断当前登陆用户是否是超级管理员
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            // 判断当前登陆用户是否是超级管理员
            if (roleId === 1) {
                return false
            } else {
                return roleType[item.id] !== "editor"
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请填写用户名!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请填写密码!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: '必选选择一个选项',
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item => {
                            return <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请选择角色类型!',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisabled(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setisDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item => {
                            return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default NewUserForm
