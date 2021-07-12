import React, { useState, useEffect, useContext, useRef } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { reqNewscategory,patchNewsCategory,delCategory } from '../../api'

const { confirm } = Modal;
const EditableContext = React.createContext(null);
export default function NewsCategory() {
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            let data = await reqNewscategory()
            setdataSource(data)
        }
        fetchData()
    }, [])

    const handleSave = (record) => {
        setdataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.value
                }
            }
            return item
        }))
        const {id,title,value} = record
        const data = {
            title,
            value
        }
        patchNewsCategory(id,data)
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <div style={{ fontWeight: "700" }}>{id}</div>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave: handleSave,
            }),
        },
        {
            title: '操作',
            align: 'center',
            width: '20%',
            render: (item) => {
                return <div>
                    <Button shape='circle' danger icon={<DeleteOutlined />} onClick={() => deleteMethod(item)}></Button>
                </div>
            }
        },
    ];

    const deleteMethod = (item) => {
        confirm({
            title: '您确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            okText: "确认",
            cancelText: "取消",
            onOk() {
                setdataSource(dataSource.filter(data => data.id !== item.id))
                delCategory(item.id)
            },
            onCancel() {
            },
        });
    }

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={(item) => item.id}
                components={
                    {
                        body: {
                            row: EditableRow,
                            cell: EditableCell,
                        },
                    }
                }
            />

        </div>
    )
}
