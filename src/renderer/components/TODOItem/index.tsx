import { useState } from 'react';
import './index.less';
import { Button, DatePicker, Form, FormProps, Input, message } from 'antd';
import { API, UpdateTodoParams } from '../../api';
import dayjs from 'dayjs';

interface TODOItemProps {
  id?: string; // 添加id属性用于API调用
  content: string;
  color: string;
  description?: string; // 添加描述
  startDate?: string; // 添加开始日期
  endDate?: string; // 添加结束日期
  onComplete?: () => void;
  onDelete?: () => void;
  refresh?: () => void;
}

type FieldType = {
  taskname?: string;
  taskPeriod: string;
  taskDesc: string;
};

const { RangePicker } = DatePicker;

export default function TODOItem(props: TODOItemProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleClick = (): void => {
    setIsExpanded(!isExpanded);
  };

  // 处理初始日期值
  const getInitialDateRange = (): [dayjs.Dayjs, dayjs.Dayjs] | undefined => {
    if (props.startDate && props.endDate) {
      return [dayjs(props.startDate), dayjs(props.endDate)];
    }
    return undefined;
  };

  // 表单提交处理 - 更新TODO数据
  const onFinish: FormProps<FieldType>['onFinish'] = async values => {
    if (!props.id) {
      message.error('缺少任务ID，无法更新');
      return;
    }

    setUpdating(true);
    try {
      // 处理日期范围
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (values.taskPeriod && Array.isArray(values.taskPeriod)) {
        startDate = values.taskPeriod[0]?.format('YYYY-MM-DD');
        endDate = values.taskPeriod[1]?.format('YYYY-MM-DD');
      }

      const updateParams: UpdateTodoParams = {
        id: props.id,
        content: values.taskname || props.content,
        ...(values.taskDesc !== undefined && { description: values.taskDesc }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
      };

      const response = await API.todo.updateTodo(updateParams);

      if (response.success) {
        message.success(response.message || '任务更新成功');
        setIsExpanded(false); // 关闭编辑区域
        props.refresh?.(); // 刷新列表
      } else {
        message.error(response.error || '更新失败');
      }
    } catch (error) {
      message.error('更新失败，请稍后重试');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`TODOItem-container ${isExpanded ? 'expanded' : ''}`}>
      <div className='main-content' onClick={handleClick}>
        <div className='TODO-content'>{props.content}</div>
        <div className='color-block' style={{ backgroundColor: props.color }}>
          <div className='default-icon'>&lt;</div>
          <div className='action-buttons'>
            <button
              className='complete-btn'
              onClick={e => {
                e.stopPropagation(); // 阻止事件冒泡
                props.onComplete?.();
              }}
            >
              完成
            </button>
            <button
              className='delete-btn'
              onClick={e => {
                e.stopPropagation(); // 阻止事件冒泡
                props.onDelete?.();
              }}
            >
              删除
            </button>
          </div>
        </div>
      </div>
      <div className={`edit-block ${isExpanded ? 'show' : 'hide'}`}>
        <Form
          name='basic'
          wrapperCol={{ span: 18 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          initialValues={{
            taskname: props.content,
            taskDesc: props.description || '',
            taskPeriod: getInitialDateRange(),
          }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType> label='任务名称' name='taskname'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='任务描述' name='taskDesc'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item<FieldType> label='结束日期' name='taskPeriod'>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={null}
            style={{
              marginTop: 'auto',
              textAlign: 'left',
            }}
          >
            <Button
              type='primary'
              htmlType='submit'
              size='small'
              loading={updating}
              disabled={updating}
              style={{ margin: '8px' }}
            >
              {updating ? '保存中...' : '保存修改'}
            </Button>
            <Button
              size='small'
              onClick={() => setIsExpanded(false)}
              disabled={updating}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
