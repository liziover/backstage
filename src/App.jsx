import React from 'react'
import {Switch,Route} from 'react-router-dom'
import Login from './components/login/Login'
import Admin from './components/admin/Admin'
import './App.css'

export default function App() {
    return (
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/" component={Admin} />
            </Switch>
    )
}
