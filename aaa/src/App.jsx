import React, { useState } from 'react';
import { 
  Progress, 
  Button, 
  Collapse, 
  List, 
  Avatar, 
  Space, 
  Card,
  Typography,
  Input,
  Popover,
  Table,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  DownOutlined, 
  UpOutlined,
  CalculatorOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import './App.less';

const { Panel } = Collapse;
const { Text } = Typography;

const InsuranceChatApp = () => {
  const [progress, setProgress] = useState(65);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'agent', content: '您好！请问贵公司需要投保的员工人数是多少？', time: '10:00' },
    { id: 2, sender: 'client', content: '我们公司大约有120名员工需要投保。', time: '10:02' },
    { id: 3, sender: 'agent', content: '好的，员工主要从事什么类型的工作？', time: '10:03' },
    { id: 4, sender: 'client', content: '主要是办公室文职和现场技术人员。', time: '10:05' },
  ]);
  const [suggestions, setSuggestions] = useState([
    '请问员工的平均年龄是多少？',
    '需要包含哪些保障项目？',
    '贵公司之前是否购买过团体意外险？',
    '您希望保障期限是多长？'
  ]);
  
  // 更新信息数据结构，添加状态字段
  const [infoItems, setInfoItems] = useState([
    { id: 1, label: '公司名称', value: 'XX科技有限公司', collected: true },
    { id: 2, label: '员工人数', value: '120人', collected: true },
    { id: 3, label: '行业类型', value: '信息技术', collected: true },
    { id: 4, label: '工作性质', value: '文职+技术', collected: true },
    { id: 5, label: '保障需求', value: '意外医疗+伤残', collected: true },
    { id: 6, label: '员工平均年龄', value: '', collected: false },
    { id: 7, label: '保障期限', value: '', collected: false },
    { id: 8, label: '特殊职业', value: '', collected: false }
  ]);
  
  // 试算历史数据
  const [calculationHistory, setCalculationHistory] = useState([
    { id: 1, time: '2023-10-15 09:30', premium: '¥12,800', status: '已保存', coverage: '意外医疗+伤残' },
    { id: 2, time: '2023-10-14 15:20', premium: '¥15,200', status: '已过期', coverage: '意外医疗+伤残+身故' },
    { id: 3, time: '2023-10-12 11:10', premium: '¥10,500', status: '已过期', coverage: '意外医疗' }
  ]);
  
  const [editingItem, setEditingItem] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleSuggestionClick = (suggestion) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'agent',
      content: suggestion,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  const toggleInfoPanel = () => {
    setIsInfoExpanded(!isInfoExpanded);
  };

  const toggleHistoryPanel = () => {
    setIsHistoryExpanded(!isHistoryExpanded);
  };

  const handleAddInfo = (item) => {
    setEditingItem(item);
    setInputValue('');
  };

  const handleAskSuggestion = (item) => {
    const question = `请问${item.label}是多少？`;
    handleSuggestionClick(question);
  };

  const handleSaveInfo = () => {
    if (editingItem && inputValue.trim()) {
      const updatedItems = infoItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, value: inputValue, collected: true } 
          : item
      );
      
      setInfoItems(updatedItems);
      setEditingItem(null);
      setInputValue('');
      
      // 更新进度
      const collectedCount = updatedItems.filter(item => item.collected).length;
      setProgress(Math.round((collectedCount / updatedItems.length) * 100));
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveInfo();
    }
  };

  const handleCalculatePremium = () => {
    // 模拟保费计算
    const newCalculation = {
      id: calculationHistory.length + 1,
      time: new Date().toLocaleString(),
      premium: `¥${Math.floor(Math.random() * 10000) + 8000}`,
      status: '已保存',
      coverage: '意外医疗+伤残'
    };
    
    setCalculationHistory([newCalculation, ...calculationHistory]);
    
    // 添加到聊天记录
    const newMessage = {
      id: messages.length + 1,
      sender: 'agent',
      content: `已根据当前信息完成保费试算：${newCalculation.premium}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  // 试算历史表格列定义
  const historyColumns = [
    {
      title: '试算时间',
      dataIndex: 'time',
      key: 'time',
      width: 150,
    },
    {
      title: '保费金额',
      dataIndex: 'premium',
      key: 'premium',
      width: 100,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: '保障范围',
      dataIndex: 'coverage',
      key: 'coverage',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => {
        let color = status === '已保存' ? 'green' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleApplyHistory(record)}>
          应用
        </Button>
      ),
    },
  ];

  const handleApplyHistory = (record) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'agent',
      content: `已应用历史试算方案：${record.premium} (${record.coverage})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-container">
      {/* 顶部进度条和信息区域 */}
      <Card className="progress-card">
        <div className="progress-header">
          <Text strong>保单信息收集进度</Text>
          <Button 
            type="primary" 
            icon={<CalculatorOutlined />}
            size="small"
            onClick={handleCalculatePremium}
          >
            保费试算
          </Button>
        </div>
        
        <Progress 
          percent={progress} 
          status="active" 
          strokeColor={{ from: '#108ee9', to: '#87d068' }}
        />
        
        {/* 试算历史区域 */}
        <div className="history-toggle" onClick={toggleHistoryPanel}>
          <Space>
            <HistoryOutlined />
            <Text>试算历史 ({calculationHistory.length})</Text>
          </Space>
          {isHistoryExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
        
        {isHistoryExpanded && (
          <div className="history-content">
            <Table 
              columns={historyColumns} 
              dataSource={calculationHistory} 
              size="small"
              pagination={false}
              rowKey="id"
              scroll={{ y: 150 }}
            />
          </div>
        )}
        
        {/* 信息收集区域 */}
        <div className="info-toggle" onClick={toggleInfoPanel}>
          <Text>已收集信息 ({infoItems.filter(item => item.collected).length}/{infoItems.length})</Text>
          {isInfoExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
        
        {isInfoExpanded && (
          <div className="info-grid">
            {infoItems.map((item) => (
              <div key={item.id} className={`info-item ${item.collected ? 'collected' : 'not-collected'}`}>
                <Text type={item.collected ? undefined : "secondary"}>{item.label}:</Text>
                
                {item.collected ? (
                  <Text strong>{item.value}</Text>
                ) : (
                  <div className="action-buttons">
                    <Popover 
                      title={`补充${item.label}`}
                      content={
                        <div className="input-popover">
                          <Input 
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleInputKeyPress}
                            placeholder={`请输入${item.label}`}
                            autoFocus
                          />
                          <Button 
                            type="primary" 
                            size="small" 
                            onClick={handleSaveInfo}
                            style={{ marginTop: 8 }}
                          >
                            保存
                          </Button>
                        </div>
                      }
                      trigger="click"
                      open={editingItem?.id === item.id}
                      onOpenChange={(visible) => {
                        if (!visible) setEditingItem(null);
                      }}
                    >
                      <Button 
                        type="dashed" 
                        size="small" 
                        icon={<PlusOutlined />}
                        onClick={() => handleAddInfo(item)}
                      >
                        补充
                      </Button>
                    </Popover>
                    
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<QuestionCircleOutlined />}
                      onClick={() => handleAskSuggestion(item)}
                    >
                      询问建议
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 聊天内容区域 */}
      <div className="chat-messages">
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(item) => (
            <List.Item className={`message-item ${item.sender}`}>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={item.sender === 'agent' ? <UserOutlined /> : <MessageOutlined />} 
                    className={item.sender}
                  />
                }
                title={<Text strong>{item.sender === 'agent' ? '客服' : '客户'}</Text>}
                description={
                  <div>
                    <div className="message-content">{item.content}</div>
                    <div className="message-time">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* 回复建议区域 */}
      <Card className="suggestions-card">
        <Text strong>回复建议:</Text>
        <Space wrap className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <Button 
              key={index} 
              size="small"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default InsuranceChatApp;
