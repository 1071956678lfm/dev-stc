import React, {Component, PropTypes} from 'react';
import {Divider, Modal, Row, Col, Card, Tabs, Select, Button, Layout, Form, Input,Radio,Checkbox,Icon,DatePicker,Collapse,message,Table, Popconfirm } from 'antd';
import moment from "moment/moment";


const TabPane = Tabs.TabPane;

const Panel = Collapse.Panel;
const Option=Select.Option;
const OptGroup=Select.OptGroup;
const FormItem=Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

//function handleChange(value) {
//    console.log(`selected ${value}`);
//}

/**
 * 功能表编辑类，让表格中的内容可以在线编辑
 * @extends Component
 */
class EditableCell extends Component {
    /**
     * value:表格的值，editable：表格某栏的编辑状态
     * @type {{value: *, editable: boolean}}
     */
    state = {
        value: this.props.value,
        editable: false,
    }
    /**
     * change函数用来响应表格某行状态的改变
     * @func
     * @param e
     */
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }

    /**
     * 检查表格状态并选择性改变表格的值
     * @function
     */
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    /**
     * edit改变表格编辑的状态
     * @func
     */
    edit = () => {
        this.setState({ editable: true });
    }

    /**
     * 渲染表格的视图
     * @returns {*}
     */
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ? (
                        <Input
                            value={value}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                            suffix={
                                <Icon
                                    type="check"
                                    className="editable-cell-icon-check"
                                    onClick={this.check}
                                />
                            }
                        />
                    ) : (
                        <div style={{ paddingRight: 24 }}>
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                    )
                }
            </div>
        );
    }
}

/**
 * ConsignContentComponent类，即委托内容组件类，代表委托内容组件部分的所有项
 * @extends Component
 */
class ConsignContentComponent extends Component  {
    /**
     * 创建并初始化一个委托内容组件类
     * 功能表定义
     * @param props - 构造委托内容的时候传入的多个数据
     * columns：功能表模块定义，dataSource：功能表数值定义，count：功能表初始数值
     */


    constructor(props) {
        super(props);
        this.columns = [{
            title: '模块编号',
            dataIndex: 'number',
            width: '10%',
        }, {
            title: '模块名称',
            dataIndex: 'name',
            width: '10%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'name')}
                />
            ),
        }, {
            title: '功能简述',
            dataIndex: 'description',
            width: '10%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'description')}
                />
            ),
        }, {
            title: '删除操作',
            dataIndex: 'operation',
            width: '10%',
            render: (text, record) => {
                return (
                    this.state.dataSource.length > 0 ?
                        (
                            <Popconfirm title="确认要删除？?" onConfirm={() => this.onDelete(record.key)}>
                                <a href="javascript:;">Delete</a>
                            </Popconfirm>

                        ) : null
                );
            },
        }];
        this.state = {
            dataSource: [{
                key: '1',
                number: 'M1',
                name: '',
                description: '',
            }, {
                key: '2',
                number: 'M2',
                name: '',
                description: '',
            }],
            count: 3,
            visible: false,
            curButtonIdx: "",
        };

    }

    /**
     * 功能表列数改变的回调函数
     * @param key 键值
     * @param dataIndex 数据的索引
     * @returns {Function}
     * @func
     */
    onCellChange = (key, dataIndex) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            const target = dataSource.find(item => item.key === key);
            if (target) {
                target[dataIndex] = value;
                this.setState({ dataSource });
            }
        };
    }
    /**
     * 删除的回调函数
     * @param key
     * @func
     */
    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }
    /**
     *
     * 功能表添加函数
     * @func
     */
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            number: `M${count}`,
            description: ``,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }

    /**
     * 规定在没有传来的值的情况下，一些属性的默认值
     * @type {{values: {}, disable: boolean, buttons: Array}}
     */
    static defaultProps = {
        values: {},
        disable:false,
        buttons: [],
        //buttonDisabled:false,
    };

    /**
     * 定义props里面的属性的类型，isRequired表示必填项
     * @type {{consignData: *, values: *, disable: *, buttons: *, form: *}}
     */
    static propTypes = {
        consignData: PropTypes.object.isRequired,
        values: PropTypes.object.isRequired,
        disable: PropTypes.bool.isRequired,
        buttons: PropTypes.array.isRequired,
        //buttonDisabled: PropTypes.bool.isRequired,
        form: PropTypes.object.isRequired,
    };

    /**
     * 在通过render()渲染界面之前，获得委托内容界面各功能项所需的值
     * @function
     */
    componentWillMount() {
        this.props.getValues(this.props.consignData.id,this.props.consignData.processInstanceID);
        let state = this.state;
        state.dataSource = this.props.values["functionList"];
        if (state.dataSource === undefined)
            state.dataSource = [];
        state.count = state.dataSource.length;
        this.setState(state);
    };

    // componentDidMount() {
    //     this.values = this.props.getValues(this.curID);
    // };

    /**
     *点击按钮映射对应功能
     * @param buttonIndex 按钮编号
     * @returns {Function} 根据按钮编号选择对应功能
     * @function
     */
    onClick = (buttonIndex) => () => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         this.props.buttons[buttonIndex].onClick(this.props.consignData, JSON.stringify(values));
        //     }
        // });
        const {buttons, form} = this.props;
        let fieldsValue = form.getFieldsValue();
        fieldsValue["functionList"] = this.state.dataSource;
        const consignation = JSON.stringify({
            ...this.props.values,
            ...fieldsValue,
        });
        // debugger;
        if(buttons[buttonIndex].content === '通过'){
            this.setState({
                ...this.state,
                visible: true,
                curButtonIdx: buttonIndex,
            })
        }
        else {
            buttons[buttonIndex].onClick(this.props.consignData, consignation);
        }
        /*switch (buttons[buttonIndex].content) {
            case '保存': message.success('保存成功');break;
            case '提交': message.success('提交成功');break;
            case '通过': message.success('委托已通过');break;
            //case 3: message.success('提交成功');break;
            default:break;
        }*/
    };

    /**
     * 改变表格值以及表格状态视图
     * @param e
     * @function
     */
    handleOk = (e) => {
        const processNo = this.props.form.getFieldsValue().processNo;
        console.log(processNo);
        this.props.buttons[this.state.curButtonIdx].onClick(this.props.consignData,processNo);
        this.setState({
            ...this.state,
            visible: false,
        });
    };

    /**
     * 取消对于表格项值的修改操作
     * @param e
     * @function
     */
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            ...this.state,
            visible: false,
        });
    };

    /**
     * 用于渲染渲染合同UI页面的视图的函数
     * 返回用于描述合同功能组件的表单
     * dataSource:功能表的值，columns:功能表模块定义，formItemLayout：，getFieldDecorator：装饰器
     * return中是前端页面显示html代码
     * @func
     */
    render() {

        const { dataSource } = this.state;
        const columns = this.columns;
        const { mode } = this.state;

        const { current } = this.state;
        const { getFieldDecorator,getFieldProps } = this.props.form;
        const formItemLayout =  {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        const formItemLayout2 =  {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };


        return (



            <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>

                <FormItem >
                    <h1 style={{textAlign:'center'}}>软件项目委托测试申请书</h1>
                </FormItem>

                <div>
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition="left"

                    >
                        <TabPane tab="单位信息" key="1">
                            <FormItem {...formItemLayout} label={"委托单位(中文)"}>
                                {getFieldDecorator('consignUnitC', {
                                    rules: [{ required: true, message: '请正确输入委托单位(中文)！' ,pattern:"^[\u4E00-\u9FA50-9]+$"}],
                                    initialValue: this.props.values.consignUnitC,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"委托单位(英文)"}>
                                {getFieldDecorator('consignUnitE', {
                                    rules: [{ required: true, message: '请正确输入委托单位(英文)！' ,pattern:"^[a-zA-Z0-9]+$"}],
                                    initialValue: this.props.values.consignUnitE,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"开发单位"}>
                                {getFieldDecorator('developUnit', {
                                    rules: [{ required: true, message: '请正确输入开发单位！',pattern:"^[\u4E00-\u9FA5A-Za-z0-9]+$" }],
                                    initialValue: this.props.values.developUnit,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"单位性质"}>
                                {getFieldDecorator('unitProp', {
                                    rules: [{ required: true, message: '请选择！'}],
                                    initialValue: this.props.values.unitProp,
                                })(
                                    <Select  style={{ width: 200 }} placeholder="请选择"
                                             disabled={this.props.disable}>
                                        <Option value={"内资企业"}>内资企业</Option>
                                        <Option value={"外(合)资企业"}>外(合)资企业</Option>
                                        <Option value={"港澳台(合)资企业"}>港澳台(合)资企业</Option>
                                        <Option value={"科研院校"}>科研院校</Option>
                                        <Option value={"政府事业团体"}>政府事业团体</Option>
                                        <Option value={"其它"}>其它</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"委托单位信息"}></FormItem>
                            {/*
                            <FormItem
                                label="委托单位信息"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitMessage', {
                                    rules: [{required: true, message: '请输入委托单位信息！'}],
                                    initialValue: this.props.values.consignUnitMessage,
                                })(
                                    <span className="ant-form-text"></span>
                                )}
                            </FormItem>
                        */}

                            <FormItem
                                label="电话"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitTelephone', {
                                    rules: [{ required: true, message: '请输入电话号码！'}],
                                    initialValue: this.props.values.consignUnitTelephone,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入电话号码" />
                                )}
                            </FormItem>

                            <FormItem
                                label="传真"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitFax', {
                                    rules: [{ required: true, message: '请输入传真号！'}],
                                    initialValue: this.props.values.consignUnitFax,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入传真号" />
                                )}

                            </FormItem>

                            <FormItem
                                label="地址"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitAddress', {
                                    rules: [{ required: true, message: '请输入地址！'}],
                                    initialValue: this.props.values.consignUnitAddress,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入地址" />
                                )}
                            </FormItem>

                            <FormItem
                                label="邮编"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitEmailNumber', {
                                    rules: [{ required: true, message: '请输入邮编！'}],
                                    initialValue: this.props.values.consignUnitEmailNumber,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入邮编" />
                                )}
                            </FormItem>

                            <FormItem
                                label="联系人"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitPeople', {
                                    rules: [{ required: true, message: '请输入联系人！'}],
                                    initialValue: this.props.values.consignUnitPeople,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入联系人" />
                                )}
                            </FormItem>

                            <FormItem
                                label="手机"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitCellPhoneNumber', {
                                    rules: [{ required: true, message: '请输入手机号码！'}],
                                    initialValue: this.props.values.cconsignUnitCellPhoneNumber,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入手机号" />
                                )}
                            </FormItem>

                            <FormItem
                                label="E-mail"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitEmail', {
                                    rules: [{ required: true, message: '请输入E-mail！'}],
                                    initialValue: this.props.values.consignUnitEmail,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入邮箱地址" />
                                )}
                            </FormItem>

                            <FormItem
                                label="网址"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('consignUnitUrl', {
                                    rules: [{ required: true, message: '请输入网址！'}],
                                    initialValue: this.props.values.consignUnitUrl,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入网址" />
                                )}
                            </FormItem>
                            <Divider/>
                            <FormItem>
                                <Row><Col offset={1}><b>国家重点实验室联系方式</b></Col></Row>
                                <Row>
                                    <Col span={3} offset={1}>单位地址</Col>
                                    <Col>南京市栖霞区仙林大道163号</Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={1}>邮政编码</Col>
                                    <Col>210046</Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={1}>电话</Col>
                                    <Col>86-25-89683467, 86-25-89683670</Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={1}>传真</Col>
                                    <Col>86-25-89686596</Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={1}>网址</Col>
                                    <Col>http://keysoftlab.nju.edu.cn</Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={1}>Email</Col>
                                    <Col>keysoftlab@nju.edu.cn</Col>
                                </Row>
                            </FormItem>

                        </TabPane>

                        <TabPane tab="软件基本信息" key="2">
                            <FormItem {...formItemLayout} label="软件名称">
                                {getFieldDecorator('softwareName', {
                                    rules: [{ required: true, message: '请输入软件名称！' }],
                                    initialValue: this.props.values.softwareName,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"版本号"}>
                                {getFieldDecorator('version', {
                                    rules: [{ required: true, message: '请正确输入版本号！',pattern:"^[a-zA-Z0-9/.]+$"}],
                                    initialValue: this.props.values.version,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="软件类型">
                                {getFieldDecorator('softwareType', {
                                    rules: [{ required: true, message: '请选择！' }],
                                    initialValue: this.props.values.softwareType,
                                })(
                                    <Select style={{ width: 200 }}
                                            disabled={this.props.disable}>
                                        <OptGroup label={"系统软件"}>
                                            <Option value={"操作系统"}>操作系统</Option>
                                            <Option value={"中文处理系统"}>中文处理系统</Option>
                                            <Option value={"嵌入式操作系统"}>嵌入式操作系统</Option>
                                            <Option value={"系统软件-其它"}>其它</Option>
                                        </OptGroup>

                                        <OptGroup label={"支持软件"}>
                                            <Option value={"程序设计语言"}>程序设计语言</Option>
                                            <Option value={"数据库系统设计"}>数据库系统设计</Option>
                                            <Option value={"工具软件"}>工具软件</Option>
                                            <Option value={"网络通信软件"}>网络通信软件</Option>
                                            <Option value={"中间件"}>中间件</Option>
                                            <Option value={"支持软件-其他"}>其他</Option>
                                        </OptGroup>

                                        <OptGroup label={"应用软件"}>
                                            <Option value={"行业管理软件"}>行业管理软件</Option>
                                            <Option value={"模式识别软件"}>模式识别软件</Option>
                                            <Option value={"图形图像软件"}>图形图像软件</Option>
                                            <Option value={"控制软件"}>控制软件</Option>
                                            <Option value={"网络应用软件"}>网络应用软件</Option>
                                            <Option value={"信息管理软件"}>信息管理软件</Option>
                                            <Option value={"数据库管理应用软件"}>数据库管理应用软件</Option>
                                            <Option value={"安全与保密软件"}>安全与保密软件</Option>
                                            <Option value={"嵌入式应用软件"}>嵌入式应用软件</Option>
                                            <Option value={"教育软件"}>教育软件</Option>
                                            <Option value={"游戏软件"}>游戏软件</Option>
                                            <Option value={"应用软件-其他"}>其他</Option>
                                        </OptGroup>

                                        <OptGroup label={"其他"}>
                                            <Option value={"其他-其他"}>其他</Option>
                                        </OptGroup>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem{...formItemLayout} label={"软件规模(至少一种)"}>
                                <FormItem offset={1}>
                                    {getFieldDecorator('softwareScaleFuncNum',
                                        {rules: [{ required: false, message: '请输入功能数！',pattern:"^[0-9]+$"}],
                                            initialValue: this.props.values.softwareScaleFuncNum,
                                        })(
                                        <Input disabled={this.props.disable}
                                               addonBefore={"功能数"}  placeholder={"到最后一级菜单"}/>
                                    )}
                                </FormItem>

                                <FormItem offset={1}>
                                    {getFieldDecorator('softwareScaleFuncPoint',
                                        {rules: [{ required: false, message: '请输入功能点数!',pattern:"^[0-9]+$"}],
                                            initialValue: this.props.values.softwareScaleFuncPoint,
                                        })(
                                        <Input disabled={this.props.disable}
                                               addonBefore={"功能点数"} />
                                    )}
                                </FormItem>

                                <FormItem offset={1}>
                                    {getFieldDecorator('softwareScaleCodeLine',
                                        {rules: [{ required: false, message: '请输入代码行数！',pattern:"^[0-9]+$"}],
                                            initialValue: this.props.values.softwareScaleCodeLine,
                                        })(
                                        <Input disabled={this.props.disable}
                                               addonBefore={"代码行数"}  placeholder={"不包括注释行和空行"}/>
                                    )}
                                </FormItem>
                            </FormItem>

                            <FormItem {...formItemLayout} label={"软件用户对象描述"}>
                                {getFieldDecorator('objDesc', {
                                    rules: [{ required: true, message: '请输入！' }],
                                    initialValue: this.props.values.objDesc,
                                })(
                                    <TextArea disabled={this.props.disable}
                                              rows={"4"}  placeholder="请输入软件用户对象描述"/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"主要功能及用途简介"}>
                                {getFieldDecorator('funcDesc', {
                                    rules: [{ required: true, message: '请输入主要功能及用途简介（限200字）！' ,max:200 }],
                                    initialValue: this.props.values.funcDesc,
                                })(
                                    <TextArea disabled={this.props.disable}
                                              rows={"4"} placeholder="限200字"/>
                                )}
                            </FormItem>
                        </TabPane>

                        <TabPane tab="软件运行环境" key="3">
                            <FormItem {...formItemLayout}label={"客户端"}/>

                            <FormItem{...formItemLayout2} label={"操作系统"}>
                                {getFieldDecorator('operateEnvironmentClientOs', {
                                    rules: [{ required: true, message: '请填写操作系统及其版本！' }],
                                    initialValue: this.props.values.operateEnvironmentClientOs,
                                })(
                                    <Checkbox.Group disabled={this.props.disable}>
                                        <Checkbox value={"Windows"}/>Windows
                                        {/*Todo 此处如何加入版本框*/}
                                        <Checkbox  value={"Linux"}/>Linux
                                        <Checkbox value={"其它"}/>其它
                                    </Checkbox.Group>
                                )}
                            </FormItem>


                            <FormItem {...formItemLayout2} label={"内存要求"}>
                                {getFieldDecorator('operateEnvironmentClientMemoryReq',
                                    {rules: [{ required: true, message: '请输入内存要求！',pattern:"^[0-9/.]+$"}],
                                        initialValue: this.props.values.operateEnvironmentClientMemoryReq,
                                    })(<Input disabled={this.props.disable} addonAfter={"MB"} />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"硬盘要求"}>
                                {getFieldDecorator('operateEnvironmentCientHardDiskReq',
                                    {rules: [{ required: true, message: '请输入硬盘要求！',pattern:"^[0-9/.]+$"}],
                                        initialValue: this.props.values.operateEnvironmentClientHardDiskReq,
                                    })
                                (<Input disabled={this.props.disable} addonAfter={"MB"} />
                                )}
                            </FormItem>

                            <FormItem{...formItemLayout} label={"服务器端——硬件"}/>

                            <FormItem{...formItemLayout2} label={"构架"}>
                                {getFieldDecorator('operateEnvironmentServiceHardwareArch', {
                                    rules: [{ required: true, message: '请选择！' }],
                                    initialValue: this.props.values.operateEnvironmentServiceHardwareArch,
                                })(
                                    <Select mode="multiple" style={{ width: '100%' }} disabled={this.props.disable}
                                            placeholder="请选择">
                                        <Option value={"PC服务器"}>PC服务器</Option>
                                        <Option value={"UNIX／Linux服务器"}>UNIX／Linux服务器</Option>
                                        <Option value={"其他"}>其他</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"内存要求"}>
                                {getFieldDecorator('operateEnvironmentServiceHardwareMemoryReq',
                                    {rules: [{ required: true, message: '请输入内存要求！',pattern:"^[0-9/.]+$"}],
                                        initialValue: this.props.values.operateEnvironmentServiceHardwareMemoryReq,
                                    })(
                                    <Input disabled={this.props.disable} addonAfter={"MB"} />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"硬盘要求"}>
                                {getFieldDecorator('operateEnvironmentServiceHardwareHardDiskReq',
                                    {rules: [{ required: true, message: '请输入硬盘要求！', pattern:"^[0-9/.]+$"}],
                                        initialValue: this.props.values.operateEnvironmentServiceHardwareHardDiskReq,
                                    })(
                                    <Input disabled={this.props.disable} addonAfter={"MB"}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"其他要求"}>
                                {getFieldDecorator('operateEnvironmentServiceHardwareOtherReq',
                                    {rules: [{ required: true, message: '请输入其他要求！'}],
                                        initialValue: this.props.values.operateEnvironmentServiceHardwareOtherReq,
                                    })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"服务器端——软件"}/>

                            <FormItem {...formItemLayout2} label={"操作系统"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftwareOs',
                                    {rules: [{ required: true, message: '请输入操作系统！'}],
                                        initialValue: this.props.values.operateEnvironmentServiceSoftwareOs,
                                    })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"版本"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftVersion', {
                                    rules: [{ required: true, message: '请输入版本！',pattern:"^[a-zA-Z0-9/.]+$"}],
                                    initialValue: this.props.values.operateEnvironmentServiceSoftVersion,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"编程语言"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftLanguage', {
                                    rules: [{ required: true, message: '请输入编程语言！'}],
                                    initialValue: this.props.values.operateEnvironmentServiceSoftLanguage,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem{...formItemLayout2} label={"构架"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftArch', {
                                    rules: [{ required: true, message: '请选择构架！' }],
                                    initialValue: this.props.values.operateEnvironmentServiceSoftArch,
                                })(
                                    <Select mode="multiple" style={{ width: '100%' }} disabled={this.props.disable}
                                            placeholder="请选择">
                                        <Option value={"C/S"}>C/S</Option>
                                        <Option value={"B/S"}>B/S</Option>
                                        <Option value={"其他"}>其他</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"数据库"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftDateBase', {
                                    rules: [{ required: true, message: '请输入数据库！'}],
                                    initialValue: this.props.values.operateEnvironmentServiceSoftDateBase,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"中间件"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftMidWare', {
                                    rules: [{ required: true, message: '请输入中间件！'}],
                                    initialValue: this.props.values.operateEnvironmentServiceSoftMidWare,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout2} label={"其他支撑软件"}>
                                {getFieldDecorator('operateEnvironmentServiceSoftOtherSupp', {
                                    rules: [{ required: true, message: '请输入其他支撑软件！'}],
                                    initialValue: this.props.values.operateEnvironmentServiceSoftOtherSupp,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"网络环境"}>
                                {getFieldDecorator('operateEnvironmentNetEnvironment', {
                                    rules: [{ required: true, message: '请输入网络环境！'}],
                                    initialValue: this.props.values.operateEnvironmentNetEnvironment,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>


                            <FormItem {...formItemLayout} label={"委托时间"}>
                                {getFieldDecorator('consignTime', {
                                    rules: [{
                                        required: true, message: '请正确输入时间！',
                                        type: 'object',
                                    }],
                                    initialValue: this.props.values.consignTime ? moment(this.props.values.consignTime) : undefined,
                                })(
                                    <DatePicker disabled={this.props.disable} showTime format="YYYY-MM-DD"/>
                                )}
                            </FormItem>
                        </TabPane>

                        <TabPane tab="委托测试信息" key="4">
                            <FormItem {...formItemLayout} label="测试类型">
                                {getFieldDecorator('testType', {
                                    rules: [{ required: true, message: '请选择至少一项测试类型!'}],
                                    initialValue: this.props.values.testType,
                                })(
                                    <Select mode="multiple" style={{ width: '100%' }} disabled={this.props.disable}
                                            placeholder="请选择">
                                        <Option value={"软件确认测试"}>软件确认测试</Option>
                                        <Option value={"成果/技术鉴定测试"}>成果/技术鉴定测试</Option>
                                        <Option value={"专项资金验收测试"}>专项资金验收测试</Option>
                                        <Option value={"其他"}>其他</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"测试依据"}>
                                {getFieldDecorator('testBasis', {
                                    rules: [{ required: true, message: '请选择至少一项测试依据！' }],
                                    initialValue: this.props.values.testBasis,
                                })(
                                    <Select mode="multiple" style={{ width: '100%' }} disabled={this.props.disable}
                                            placeholder="请选择">
                                        <Option value={"GB/T 25000.51-2016"}>GB/T 25000.51-2016</Option>
                                        <Option value={"GB/T 25000.10-2016"}>GB/T 25000.10-2016</Option>
                                        <Option value={"GB/T 28452-2012"}>GB/T 28452-2012</Option>
                                        <Option value={"GB/T 30961-2014"}>GB/T 30961-2014</Option>
                                        <Option value={"NST-03-WI12-2011"}>NST-03-WI12-2011</Option>
                                        <Option value={"ST-03-WI13-2011"}>ST-03-WI13-2011</Option>
                                        <Option value={"NST-03-WI22-2014"}>NST-03-WI22-2014</Option>
                                        <Option value={"其他"}>其他</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"测试技术指标"}>
                                {getFieldDecorator('testIndicator', {
                                    rules: [{ required: true, message: '请选择至少一项技术指标！' }],
                                    initialValue: this.props.values.testIndicator,
                                })(
                                    <Select mode="multiple" style={{ width: '100%' }} disabled={this.props.disable}
                                            placeholder="请选择" >
                                        <Option value={"功能性"}>功能性</Option>
                                        <Option value={"可靠性"}>可靠性</Option>
                                        <Option value={"易用性"}>易用性</Option>
                                        <Option value={"效率"}>效率</Option>
                                        <Option value={"可维护性"}>可维护性</Option>
                                        <Option value={"可移植性"}>可移植性</Option>
                                        <Option value={"代码覆盖度"}>代码覆盖度</Option>
                                        <Option value={"缺陷检测率"}>缺陷检测率</Option>
                                        <Option value={"代码风格符合度"}>代码风格符合度</Option>
                                        <Option value={"代码不符合项检测率"}>代码不符合项检测率</Option>
                                        <Option value={"产品说明要求"}>产品说明要求</Option>
                                        <Option value={"用户文档集要求"}>用户文档集要求</Option>
                                        <Option value={"其他"}>其他</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"软件介质"}>
                                <FormItem>
                                    {getFieldDecorator('sampleQuantitySoftwareMediaCd', {
                                        rules: [{pattern:"^[0-9/]+$", message: '请输入光盘数！'}],
                                        initialValue: this.props.values.sampleQuantitySoftwareMediaCd,
                                    })(
                                        <Input addonBefore={"光盘数量"} disabled={this.props.disable}/>
                                    )}
                                </FormItem>

                                <FormItem>
                                    {getFieldDecorator('sampleQuantitySoftwareMediaU', {
                                        rules: [{pattern:"^[0-9/]+$", message: '请输入U盘数！'}],
                                        initialValue: this.props.values.sampleQuantitySoftwareMediaU,
                                    })(
                                        <Input addonBefore={"U盘数量"} disabled={this.props.disable}/>
                                    )}
                                </FormItem>

                                <FormItem>
                                    {getFieldDecorator('sampleQuantitySoftwareMediaOther', {
                                        rules: [{pattern:"^[0-9/]+$", message: '请输入其他数量！'}],
                                        initialValue: this.props.values.sampleQuantitySoftwareMediaOther,
                                    })(
                                        <Input addonBefore={"其他数量"} disabled={this.props.disable}/>
                                    )}
                                </FormItem>

                            </FormItem>

                            <FormItem {...formItemLayout} label={"文档资料"}>
                                {getFieldDecorator('sampleQuantityDocumentation', {
                                    rules: [{ required: true, message: '请输入文档资料！'}],
                                    initialValue: this.props.values.sampleQuantityDocumentation,
                                })(
                                    <Input disabled={this.props.disable}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"注"}>
                                <br/>1、需求文档（例如：项目计划任务书、需求分析报告、合同等）（验收、鉴定测试必须）
                                <br/>2、用户文档（例如：用户手册、用户指南等）（必须）
                                <br/>3、操作文档（例如：操作员手册、安装手册、诊断手册、支持手册等）（验收项目必须）
                            </FormItem>

                            <FormItem {...formItemLayout}   colon={false} label={""}>

                            </FormItem>

                            <FormItem  {...formItemLayout} label={"样品处理"}>提交的样品（硬拷贝资料、硬件）五年保存期满
                                {getFieldDecorator('sampleQuantityToHandle', {
                                    rules: [{ required: true, message: '请选择！'}],
                                    initialValue: this.props.values.sampleQuantityToHandle,
                                })(
                                    <Select style={{ width: 200 }} disabled={this.props.disable}
                                            placeholder="请选择">
                                        <Option value={"由本实验室销毁"}>由本实验室销毁</Option>
                                        <Option value={"退还给我们"}>退还给我们</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"希望测试完成的时间"}>
                                {getFieldDecorator('sampleQuantityComTimeWish', {
                                    rules: [{
                                        required: true, message: '请正确输入时间！',
                                        type: 'object',
                                    }],
                                    initialValue: this.props.values.sampleQuantityComTimeWish ? moment(this.props.values.sampleQuantityComTimeWish) : undefined,
                                })(
                                    <DatePicker disabled={this.props.disable} showTime format="YYYY-MM-DD"/>
                                )}
                            </FormItem>


                            <FormItem
                                {...formItemLayout}
                                label="密级"
                            >
                                {getFieldDecorator('securityLevel', {
                                    rules: [{ required: true, message: '请选择！'}],
                                    initialValue: this.props.values.securityLevel,
                                })(
                                    <RadioGroup name={"密级:"} disabled={this.props.disable}>
                                        <Radio value="a">无密级</Radio>
                                        <Radio value="b">秘密</Radio>
                                        <Radio value="c">机密</Radio>
                                    </RadioGroup>

                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="查杀病毒"
                            >
                                {getFieldDecorator('killingVirus', {
                                    rules: [{ required: true, message: '请选择！'}],
                                    initialValue: this.props.values.killingVirus,
                                })(
                                    <RadioGroup name={"查杀病毒:"} disabled={this.props.disable}>
                                        <Radio value="a">已完成</Radio>
                                        <Radio value="b">无法完成</Radio>
                                        <Input disabled={this.props.disable} placeholder="所用查杀工具" />
                                    </RadioGroup>

                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="材料检查："
                            ><span className="ant-form-text"></span>
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="需求文档："
                            >
                                {getFieldDecorator('requirementsDocument', {
                                    rules: [{ required: true, message: '请选择至少一项需求文档！'}],
                                    initialValue: this.props.values.requirementsDocument,
                                })(
                                    <Checkbox.Group disabled={this.props.disable}>
                                        <Checkbox value={"项目计划任务书"}/>项目计划任务书
                                        <Checkbox value={"需求分析报告"}/>需求分析报告
                                        <Checkbox value={"合同"}/>合同
                                    </Checkbox.Group>
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="用户文档："
                            >
                                {getFieldDecorator('userDocument', {
                                    rules: [{ required: true, message: '请选择至少一项用户文档！'}],
                                    initialValue: this.props.values.userDocument,
                                })(
                                    <Checkbox.Group disabled={this.props.disable}>
                                        <Checkbox value={"用户手册"}/>用户手册
                                        <Checkbox value={"用户指南"}/>用户指南
                                    </Checkbox.Group>
                                )}
                            </FormItem>

                            <FormItem

                                {...formItemLayout}
                                label="操作文档："
                            >
                                {getFieldDecorator('oprationDocument', {
                                    rules: [{ required: true, message: '请选择至少一项操作文档！'}],
                                    initialValue: this.props.values.oprationDocument,
                                })(
                                    <Checkbox.Group disabled={this.props.disable}>
                                        <Checkbox value={"操作员手册"}/>操作员手册
                                        <Checkbox value={"安装手册"}/>安装手册
                                        <Checkbox value={"诊断手册"}/>诊断手册
                                        <Checkbox value={"支持手册"}/>支持手册
                                    </Checkbox.Group>
                                )}
                            </FormItem
                            >

                            <FormItem
                                label="其他"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('elseA', {
                                    rules: [{ required: true, message: '请输入！'}],
                                    initialValue: this.props.values.elseA,
                                })(
                                    <Input disabled={this.props.disable} placeholder="请输入" />
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="确认意见："
                            >
                                {getFieldDecorator('confirmationE', {
                                    rules: [{ required: true, message: '请选择确认意见！'}],
                                    initialValue: this.props.values.confirmationE,
                                })(
                                    <RadioGroup name={"确认意见:"} disabled={this.props.disable}>
                                        <Radio value="a">测试所需材料不全，未达到受理条件。</Radio>
                                        <Radio value="b">属依据国家标准或自编非标规范进行的常规检测，有资质、能力和资源满足委托方要求。</Radio>
                                        <Radio value="c">无国家标准和规范依据，或实验室缺乏检测设备和工具，无法完成检测。</Radio>
                                        <Radio value="d">超出实验室能力和资质范围，无法完成检测。</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="受理意见："
                            >
                                {getFieldDecorator('admissiBility', {
                                    rules: [{ required: true, message: '请选择受理意见！'}],
                                    initialValue: this.props.values.admissiBility,
                                })(
                                    <RadioGroup name={"受理意见:"} disabled={this.props.disable}>
                                        <Radio value="a">受理-进入项目立项和合同评审流程。</Radio>
                                        <Radio value="b">不受理</Radio>
                                        <Radio value="c">进一步联系</Radio>
                                    </RadioGroup>

                                )}
                            </FormItem>

                            {/*<FormItem label="测试项目编号"*/}
                                      {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*{getFieldDecorator('testingNumber', {*/}
                                    {/*rules: [{ required: true, message: '请输入测试项目编号！'}],*/}
                                    {/*initialValue: this.props.values.testingNumber,*/}
                                {/*})(*/}
                                    {/*<Input disabled={this.props.disable} placeholder="请输入测试项目编号" />*/}
                                {/*)}*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*label="备注"*/}
                                {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*{getFieldDecorator('remarksE', {*/}
                                    {/*rules: [{ required: true, message: '请输入备注！'}],*/}
                                    {/*initialValue: this.props.values.remarksE,*/}
                                {/*})(*/}
                                    {/*<TextArea disabled={this.props.disable} rows={4} />*/}
                                {/*)}*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*label="受理人（签字）"*/}
                                {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*<span className="ant-form-text"></span>*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*label="日期"*/}
                                {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*<span className="ant-form-text"></span>*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*label="委托人填写"*/}
                                {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*<TextArea disabled={this.props.disable} rows={4} />*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*label="委托人（签字）"*/}
                                {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*<span className="ant-form-text"></span>*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*label="日期"*/}
                                {/*{...formItemLayout}*/}
                            {/*>*/}
                                {/*<span className="ant-form-text"></span>*/}
                            {/*</FormItem>*/}

                        </TabPane>

                        <TabPane tab="测试软件功能列表" key="5">
                            <div>
                                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                                    添加测试功能
                                </Button>
                                <Table bordered dataSource={dataSource} columns={columns} />
                            </div>

                        </TabPane>


                    </Tabs>

                </div>

                {/* footer buttons */}        {/*console.log(buttonsDisabled)*/}
                <FormItem style={{textAlign:'center'}}>
                    {this.props.buttons.map((button, index) => {
                        let buttonCanShow = false;
                        this.props.buttonsEnable.forEach(function(element){
                            if(element.content === button.content && element.enable){
                                buttonCanShow = true;
                            }});
                        if(buttonCanShow){
                            return <Button
                                //disabled={this.props.buttonDisabled}
                                onClick={this.onClick(index)}
                                key={button.content}>
                                {button.content}
                            </Button>
                        }
                    })}
                </FormItem>

                <FormItem style={{textAlign:'center'}}>
                    <Modal
                        visible={this.state.visible}
                        title="填写项目信息"
                        // okText="Create"
                        onCancel={this.handleCancel}
                        onOk={this.handleOk}
                    >
                        <Form layout="vertical">
                            <FormItem>
                                {getFieldDecorator('processNo', {
                                    rules: [{ required: true, message: '请输入项目编号!' }],
                                })(
                                    <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="ProcessNo" />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </FormItem>
            </Form>

        );
    }
}

export default Form.create()(ConsignContentComponent);
