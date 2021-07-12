import React, { forwardRef, useState,useEffect } from 'react'
import { Form, Select, Input } from 'antd'
import {roleType} from '../../config/roleType'

const { Option } = Select;
const NewUserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)

    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])


    useEffect(() => {
        setisDisabled(props.addUserEnd)
    }, [props.addUserEnd])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))

    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (roleId === 1) {
                return false
            } else {
                return item.value !== region
            }
        }
    }

    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
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
