import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment'
import { reqNewsInfo } from '../../api'

// 审核状态值
const auditStateList = ["未通过","审核中","已通过","未通过"]

// 发布状态值
const publishStateList = ["未发布","待发布","已上线","已下线"]

const colorList = ["black","orange","green","red"]

export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            let data = await reqNewsInfo(props.match.params.id)
            setNewsInfo(data)
        }
        fetchData()
    }, [props.match.params.id])

    return (
        newsInfo && <div>
            <PageHeader
                ghost={false}
                title={newsInfo.title}
                subTitle={newsInfo.category.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss ")}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime !== 0? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss ") : "-"}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><span style={{color:colorList[newsInfo.auditState]}}>{auditStateList[newsInfo.auditState]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><span style={{color:colorList[newsInfo.publishState]}}>{publishStateList[newsInfo.publishState]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{border:'1px solid #ccc',padding:'20px'}} >
            </div>
        </div>

    )
}
