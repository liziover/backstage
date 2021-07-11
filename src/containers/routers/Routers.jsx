import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { Switch, Route, Redirect } from 'react-router-dom'
import Nopermission from '../../pages/nopermission/Nopermission'
import routerList from '../../config/routerList'
import { reqChildrenMeau, reqRightsMeau } from '../../api'

function Routers(props) {
    const [bcakRouterList, setbackRouterList] = useState([])

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const fetchData = async () => {
            let data = [...await reqChildrenMeau(), ...await reqRightsMeau()]
            setbackRouterList(data)
        }
        fetchData()
    }, [])

    const checkRoute = (item) => {
        return routerList[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <Spin size="large" spinning={props.isLoading} >
            <Switch>
                {
                    bcakRouterList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} component={routerList[item.key]} key={item.key} exact />
                        }
                        return null
                    })
                }
                <Redirect from="/" to="/home" exact />
                {
                    bcakRouterList.length > 0 && <Route path="*" component={Nopermission} />
                }
            </Switch>
        </Spin >
    )
}


export default connect(
    state=> ({
        isLoading:state.changLoading
    })
)(Routers)
