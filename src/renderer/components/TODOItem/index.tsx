import { useState } from 'react';
import './index.less';
import { Button, DatePicker, Form, FormProps, Input, message } from 'antd';
import {
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { API } from '../../api';
import dayjs from 'dayjs';
import { UpdateTodoParams } from '@/renderer/api/TODOList/types';

interface TODOItemProps {
  id?: string;
  content: string;
  color: string;
  completed?: boolean;
  description?: string;
  startDate?: string;
  endDate?: string;
  onComplete?: () => void;
  onDelete?: () => void;
  refresh: () => void;
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
        setIsExpanded(false);
        props.refresh();
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
    <div
      className={`TODOItem-container ${isExpanded ? 'expanded' : ''} ${props.completed ? 'completed' : 'active'}`}
    >
      <div className='main-content' onClick={handleClick}>
        <div
          className={`TODO-content ${props.completed ? 'completed-text' : ''}`}
        >
          {props.completed && (
            <CheckCircleOutlined className='completed-icon' />
          )}
          <span className='content-text'>{props.content}</span>
        </div>
        <div className='task-meta'>
          {props.description && (
            <span className='description'>{props.description}</span>
          )}
          {(props.startDate || props.endDate) && (
            <span className='date-range'>
              {props.startDate && dayjs(props.startDate).format('MM/DD')}
              {props.startDate && props.endDate && ' - '}
              {props.endDate && dayjs(props.endDate).format('MM/DD')}
            </span>
          )}
        </div>
        <div className='color-block' style={{ backgroundColor: props.color }}>
          <div className={`default-icon ${isExpanded ? 'expanded' : ''}`}>
            <EditOutlined />
          </div>
          <div className='action-buttons'>
            <button
              className={`complete-btn ${props.completed ? 'undo' : 'complete'}`}
              onClick={e => {
                e.stopPropagation();
                props.onComplete?.();
              }}
              title={props.completed ? '重新激活' : '标记完成'}
            >
              {props.completed ? <UndoOutlined /> : <CheckCircleOutlined />}
              {props.completed ? '激活' : '完成'}
            </button>
            <button
              className='delete-btn'
              onClick={e => {
                e.stopPropagation();
                props.onDelete?.();
              }}
              title='删除任务'
            >
              <DeleteOutlined />
              删除
            </button>
          </div>
        </div>
      </div>
      <div className={`edit-block ${isExpanded ? 'show' : 'hide'}`}>
        <Form
          name='basic'
          layout='vertical'
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
            <Input placeholder='请输入任务名称' />
          </Form.Item>
          <Form.Item<FieldType> label='任务描述' name='taskDesc'>
            <Input placeholder='请输入任务描述' />
          </Form.Item>
          <Form.Item<FieldType> label='任务期限' name='taskPeriod'>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
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
              style={{ marginRight: '8px' }}
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
