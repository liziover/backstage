import React, { useState, useEffect, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message, notification, PageHeader } from 'antd';
import { reqNewscategory, postNews } from '../../api'
import NewsEditor from '../../components/newsEditor/NewsEditor'


const { Option } = Select;
const { Step } = Steps;
export default function NewsAdd(props) {
    // 编辑阶段的状态值
    const [currentNews, setcurrentNews] = useState(0)
    // 保存类别的状态
    const [newsCategory, setnewsCategory] = useState([])
    // 将form表单内容保存到状态中
    const [formInfo, setformInfo] = useState({})
    // 将富文本编辑器的内容保存到状态中
    const [content, setcontent] = useState("")
    const newsForm = useRef(null)

    const { region, username, roleId } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        const fetchData = async () => {
            let data = await reqNewscategory()
            setnewsCategory(data)
        }
        fetchData()
    }, [])

    // 处理点击下一步按钮的回调
    const handleNext = () => {
        // 判断当前撰写是否处于第一步
        if (currentNews === 0) {
            // 对 form 表单校验
            newsForm.current.validateFields().then(
                res => {
                    setformInfo(res)
                    setcurrentNews(currentNews + 1)
                }
            ).catch(err => {
                console.log(err);
            })
        } else {
            // 判断当前文本编辑器用户是否输入内容
            if (content === "" || content.length <= 8) {
                message.warning('您还没有输入内容', 2);
            } else {
                setcurrentNews(currentNews + 1)
            }
        }
    }

    // 处理点击上一部按钮的回调
    const handlePrevious = () => {
        setcurrentNews(currentNews - 1)
    }

    // 处理保存到草稿箱、或提交审核的回调
    const handleSave = (auditState) => {
        const data = {
            ...formInfo,
            "region": region ? region : "全球",
            "content": content,
            "author": username,
            "roleId": roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            "publishTime": 0
        }
        postNews(data)
        props.history.replace(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
        notification.info({
            message: `通知`,
            description:
                `您可以到${auditState ? "审核列表" : "草稿"}中查看您的新闻`,
            placement: "bottomRight",
        });
    }

    return (
        <div className="newsadd">
            <PageHeader
                title="撰写"
            />
            <Steps className="news_step" current={currentNews}>
                <Step title="基本信息" description="标题，分类" />
                <Step title="内容" description="主体内容" />
                <Step title="提交" description="保存草稿或提交审核" />
            </Steps>
            <div style={{ marginTop: "50px" }}>
                <Form
                    name="news"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    ref={newsForm}
                >
                    <div style={{ display: currentNews === 0 ? "block" : "none" }}>
                        <Form.Item
                            label="标题"
                            name="title"
                            rules={[{ required: true, message: '请填写标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择所属类别!' }]}
                        >
                            <Select>
                                {
                                    newsCategory.map(item => {
                                        return <Option id={item.id} key={item.id} >{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div style={{ display: currentNews === 1 ? 'block' : 'none' }}>
                        <NewsEditor getContent={value => {
                            setcontent(value)
                        }} />
                    </div>
                </Form>
            </div>

            <div style={{ position: "fixed", marginTop: "50px" }}>
                {
                    currentNews < 2 && <Button type="primary" onClick={handleNext} style={{ marginRight: "10px" }} >下一步</Button>
                }
                {
                    currentNews > 0 && <Button onClick={handlePrevious} style={{ marginRight: "10px" }}>上一步</Button>
                }
                {
                    currentNews === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(1)}>提交审核</Button> <Button type="primary" onClick={() => handleSave(0)} >保存草稿箱</Button>
                    </span>
                }
            </div>
        </div>
    )
}

