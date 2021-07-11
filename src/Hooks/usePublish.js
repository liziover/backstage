import axios from 'axios'
import {notification,Modal} from 'antd'
import {useState, useEffect } from 'react'
import {reqNews,delNews} from '../api'

const { confirm } = Modal;
function UserPublish (type) {
    const [dataSource, setdataSource] = useState([])
    
    const {username} = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        const fetchData = async() => {
            let data = await reqNews(username,type)
            setdataSource(data)
        }
        fetchData()
    }, [username,type])

    // 处理删除新闻的回调
    const handleDelete = (id) => {
        confirm({
            title: '您确定要删除已下线的这条新闻么?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                setdataSource(dataSource.filter(data => data.id !== id))
                // 后端删除新闻
                delNews(id)
            },
            onCancel() {
            },
          });
    }

    //  处理下线新闻的回调
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        // 后端同步数据更新
        axios.patch(`http://localhost:5000/news/${id}`,{
            publishState:3
        })
        notification.open({
            message: '通知',
            description:
              '您可以到【发布管理/已下线】中查看您下线的新闻',
              placement:'bottomRight'
          });
    }
    
    // 处理新闻发布的回调
    const handlePublish = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`,{
            publishTime:Date.now(),
            publishState: 2
        })
        notification.open({
            message: '通知',
            description:
              '您可以到【发布管理/已发布】中查看您下线的新闻',
              placement:'bottomRight'
          });
    }

    return {
        dataSource,
        handleDelete,
        handleSunset,
        handlePublish
    }
}

export default UserPublish