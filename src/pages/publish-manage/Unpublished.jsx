import React from 'react'
import {Button} from 'antd'
import PublishManage from '../../components/publishManage/PublishManage'
import UserPublish from '../../Hooks/usePublish'

export default function Unpublished() {
    // 1 --- 未发布的文章
    const {dataSource,handlePublish} = UserPublish(1)
    return (
        <PublishManage dataSource={dataSource} button={(id) => <Button type="primary" onClick={() => handlePublish(id)} >发布</Button>}/>
    )
}
