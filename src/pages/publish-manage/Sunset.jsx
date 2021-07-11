import React from 'react'
import {Button} from 'antd'
import PublishManage from '../../components/publishManage/PublishManage'
import UserPublish from '../../Hooks/usePublish'

export default function Sunset() {
    // 3----已下线的文章
    const {dataSource,handleDelete} = UserPublish(3)
    return (
        <PublishManage dataSource={dataSource} button={(id) => <Button danger onClick={() => handleDelete(id)} >删除</Button>} />
    )
}
