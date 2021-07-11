import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import {  PieChartOutlined, UserOutlined } from '@ant-design/icons';
import * as Echarts from 'echarts'
import _ from 'lodash'
import { reqViewNews, reqStarNews, reqPublishNew } from '../../api'

const { Meta } = Card;
export default function Home() {
    const [viewNews, setviewNews] = useState([])
    const [starNews, setstarNews] = useState([])
    const [allNews, setallNews] = useState([])
    const [pieChart, setpieChart] = useState(null)
    const [visible, setvisible] = useState()
    const barRef = useRef(null)
    const pieRef = useRef(null)

    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))

    // 以点击量排序的方式保存到状态中
    useEffect(() => {
        const fetchData = async () => {
            let data = await reqViewNews()
            setviewNews(data)
        }
        fetchData()
    }, [])

    //  以点赞量排序的方式保存到状态中
    useEffect(() => {
        const fetchData = async () => {
            let data = await reqStarNews()
            setstarNews(data)
        }
        fetchData()
    }, [])

    // 将所有已发布的文章保存到状态中
    useEffect(() => {
        const fetchData = async () => {
            let data = await reqPublishNew()
            renderBarView(_.groupBy(data, item => item.category.title))
            setallNews(data)
        }
        fetchData()
        return () => {
            window.onresize = null
        }
    }, [])

    const renderBarView = (obj) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: '70',
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            myChart.resize()
        }
    }

    const renderPieView = () => {
        // 数据处理
        var currentNews = allNews.filter(item => item.author === username)
        var groupObj = _.groupBy(currentNews, item => item.category.title)
        var list = []
        for(var i in groupObj){
            list.push({
                value:groupObj[i].length,
                name:i          
            })
        }
        var myChart;
        if (!pieChart) {
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart)
        } else {
            myChart = pieChart;
        }

        var option = {
            title: {
                text: '当前用户文章分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true} hoverable={true}>
                        <List
                            size="small"
                            bordered
                            dataSource={viewNews}
                            renderItem={item => <List.Item><a href={`news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                            pagination={{
                                pageSize:7
                            }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true} hoverable={true}>
                        <List
                            size="small"
                            bordered
                            dataSource={starNews}
                            renderItem={item => <List.Item><a href={`news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                            pagination={{
                                pageSize:7
                            }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                            
                        }
                        hoverable={true}
                        actions={[
                            <PieChartOutlined key="pie" onClick={() => {
                                setTimeout(() => {
                                    setvisible(true)
                                    // init初始化
                                    renderPieView()
                                }, 0)
                            }} />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={username}
                            description={
                                <div>
                                    <b style={{ marginRight: "10px" }}>{region === "" ? "全球" : region}</b>
                                    {roleName}
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                width="500px"
                title="个人分类"
                placement="right"
                closable={true}
                onClose={() => setvisible(false)}
                visible={visible}
            >

                <div ref={pieRef} id="main" style={{
                    height: "400px",
                    marginTop: "30px"
                }}></div>
            </Drawer>

            <div ref={barRef} id="main" style={{
                height: "400px",
                marginTop: "30px"
            }}></div>
        </div>
    )
}
