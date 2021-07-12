import React, { useState, useEffect } from 'react'
import { Menu } from 'antd';
import { withRouter, Link } from 'react-router-dom'
import logo from '../../static/images/logo.jpg'
import { reqMeauList } from '../../api'
import './sideMeau.less'

const { SubMenu } = Menu;
function SideMeau(props) {
    const [meauList, setmeauList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            let result = await reqMeauList()
            setmeauList(result)
        }
        fetchData()
    }, [])

    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))

    // 
    const checkPagepermisson = (item) => {
       return item.pagepermisson && rights.includes(item.key)
    }

    const renderMeau = (meauList) => {
        return meauList.map(item => {
            if (item.children?.length > 0 && checkPagepermisson(item)) {
                return <SubMenu id={item.id} key={item.key} title={item.title}>
                    {renderMeau(item.children)}
                </SubMenu>
            }
            return checkPagepermisson(item) ? <Menu.Item id={item.id} key={item.key} >
                <Link to={item.key}>
                    {item.title}
                </Link>
            </Menu.Item> : ""

        })
    }
    const key = { openKey: ["/" + props.location.pathname.split("/")[1]] }
    return (
        <div className="side_meau">
            <div className="top_bar">
                <img className="logo" src={logo} alt="logo" />
                <span className="title">后台管理系统</span>
            </div>
            <div className="meau">
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={props.location.pathname}
                    defaultOpenKeys={key.openKey}
                >
                    {renderMeau(meauList)}
                </Menu>
            </div>
        </div >

    )
}

export default withRouter(SideMeau)