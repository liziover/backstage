import React,{useState,useEffect} from 'react'
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom"
import {reqChildrenMeau,reqRightsMeau} from '../../api'
import './header.less'

function TopHeader(props) {
    const [meauTitle, setmeauTitle] = useState('')

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

    const signOut = () => {
        localStorage.removeItem('token')
        props.history.replace('/login')
    }

    useEffect(() => {
        const fetchData = async() => {
            let data = [...await reqChildrenMeau(),...await reqRightsMeau()]
            const list = data.find(item => item.key === props.location.pathname)
            setmeauTitle(list?.title)
        }
        fetchData()
    }, [props.location.pathname])

    const menu = (
        <Menu>
            <Menu.Item key='1' >
                {roleName}
            </Menu.Item>
            <Menu.Item key='2' danger onClick={() =>signOut()}>
                退出
            </Menu.Item>
        </Menu>
    )
    
    
    return (
        <header className="header">
            <div className="title">
                { meauTitle}
            </div>
            <div className="userInfo">
                <span>欢迎 <span className="user" >{username}</span></span>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </header>
    )
}

export default withRouter(TopHeader)