import React from 'react'
import { Layout, } from 'antd';
import {Redirect} from 'react-router-dom'
import SideMeau from '../sideMeau/SideMeau'
import Header from '../header/Header'
import Routers from '../../containers/routers/Routers'
import './admin.less'

const { Sider, Content, Footer } = Layout;
export default function Admin() {
    // 判断当前用户是否已经登陆
    if (!localStorage.getItem("token")) {
       return  <Redirect to='/login' />
    } else {
        return (
            <Layout className="admin">
                <Sider>
                    <SideMeau />
                </Sider>
                <Layout>
                    <Header />
                    <Content className="content">
                        <Routers />
                    </Content>
                    <Footer className="footer">使用谷歌浏览器，获取更好的使用体验</Footer>
                </Layout>
            </Layout>
        )
    }

}