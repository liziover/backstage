import React from 'react'
import {Button} from 'antd'
import PublishManage from '../../components/publishManage/PublishManage'
import UserPublish from '../../Hooks/usePublish'

export default function Published() {
    // 2--- 已发布的文章
    const {dataSource,handleSunset} = UserPublish(2)
    return (
        <PublishManage dataSource={dataSource} button={(id) => <Button danger onClick={() => handleSunset(id)} >下线</Button>} />
    )
}
