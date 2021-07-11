import React from 'react'
import { Result, Button } from 'antd';

export default function Nopermission(props) {
    const backHome = () => {
        props.history.replace('/home')
    }
    return (
        <Result
        status="404"
        title="404"
        subTitle="此页面未找到!"
        extra={<Button type="primary" onClick={backHome}>Back Home</Button>}
        />
    )
}
