import React, { useState, useEffect } from 'react';
import { Button, Select, Input, message, Modal, Form, Spin } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import './index.less';
import {
  CreateNewNoteParam,
  DeleteNoteParam,
  Note,
  UpdateNoteContentParam,
} from '../../api/Note/types';
import API from '@/renderer/api';

const { TextArea } = Input;
const { Option } = Select;

export default function NotePage(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  useEffect(() => {
    fetchNotes();
  }, []);

  // 获取所有笔记
  const fetchNotes = async (): Promise<void> => {
    setIsLoading(true);
    const response = await API.note.getAllNotes();
    if (response.success && response.data) {
      setNotes(response.data);
      setCurrentNote(response.data[0]);
      setCurrentNoteId(response.data[0].id);
      setEditContent(response.data[0].content);
    }
    setIsLoading(false);
  };

  // 切换笔记
  const handleNoteChange = (noteId: string): void => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNoteId(noteId);
      setCurrentNote(note);
      setEditContent(note.content);
      setIsEditing(false);
    }
  };

  // 开始编辑
  const handleStartEdit = (): void => {
    setIsEditing(true);
  };

  // 保存编辑
  const handleSaveEdit = async (): Promise<void> => {
    if (currentNote && currentNoteId) {
      const param: UpdateNoteContentParam = {
        id: currentNoteId,
        content: editContent,
      };
      const response = await API.note.updateNoteContent(param);
      if (response.success) {
        const updatedNotes = notes.map(note =>
          note.id === currentNote.id
            ? {
                ...note,
                content: editContent,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : note
        );
        setNotes(updatedNotes);
        setCurrentNote({ ...currentNote, content: editContent });
        setIsEditing(false);
        message.success('笔记保存成功');
      } else {
        message.error('笔记保存失败');
      }
    }
  };

  // 取消编辑
  const handleCancelEdit = (): void => {
    if (currentNote) {
      setEditContent(currentNote.content);
    }
    setIsEditing(false);
  };

  // 新建笔记
  const handleCreateNote = async (values: { title: string }): Promise<void> => {
    setIsCreating(true);
    const param: CreateNewNoteParam = {
      id: Date.now().toString(),
      title: values.title,
      content: '',
    };
    const response = await API.note.createNewNote(param);
    if (response && response.data) {
      const updatedNotes = [response.data, ...notes];
      setNotes(updatedNotes);
      setCurrentNoteId(response.data.id);
      setCurrentNote(response.data);
      setEditContent('');
      setIsEditing(true);
      setIsCreating(false);
      setShowCreateModal(false);
      createForm.resetFields();
      message.success('笔记创建成功');
    } else {
      setIsCreating(false);

      message.error('笔记创建失败');
    }
  };

  // 删除笔记
  const handleDeleteNote = (): void => {
    if (!currentNote || !currentNoteId) return;

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除笔记"${currentNote.title}"吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const param: DeleteNoteParam = {
          id: currentNoteId,
        };
        const response = await API.note.deleteNote(param);
        if (response.success) {
          fetchNotes();
          message.success('笔记删除成功');
        } else {
          message.error('笔记删除失败');
        }
      },
    });
  };

  return (
    <div className='note-page-container'>
      {/* 工具栏 */}
      <div className='note-toolbar'>
        {isLoading ? (
          <Spin />
        ) : (
          <div className='toolbar-left'>
            <Select
              value={currentNoteId}
              onChange={handleNoteChange}
              style={{ width: 200 }}
              showSearch
              optionFilterProp='children'
            >
              {notes.map(note => (
                <Option key={note.id} value={note.id}>
                  {note.title}
                </Option>
              ))}
            </Select>
          </div>
        )}

        <div className='toolbar-right'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setShowCreateModal(true)}
          >
            新建
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteNote}
            disabled={!currentNote}
          >
            删除
          </Button>
        </div>
      </div>

      {/* 主编辑区域 */}
      {isLoading ? (
        <Spin />
      ) : (
        <div className='note-content-area'>
          {currentNote ? (
            <>
              <div className='note-header'>
                <h2 className='note-title'>{currentNote.title}</h2>
                <div className='note-meta'>
                  <span>创建时间：{currentNote.createdAt}</span>
                  <span>更新时间：{currentNote.updatedAt}</span>
                </div>
                <div className='note-actions'>
                  {!isEditing ? (
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={handleStartEdit}
                    >
                      编辑
                    </Button>
                  ) : (
                    <div className='edit-actions'>
                      <Button
                        type='primary'
                        icon={<SaveOutlined />}
                        onClick={handleSaveEdit}
                      >
                        保存
                      </Button>
                      <Button onClick={handleCancelEdit}>取消</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className='note-content'>
                {isEditing ? (
                  <TextArea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder='在这里输入你的笔记内容...'
                    autoSize={{ minRows: 15, maxRows: 30 }}
                    className='note-editor'
                  />
                ) : (
                  <div className='note-display'>
                    {currentNote.content ? (
                      <pre>{currentNote.content}</pre>
                    ) : (
                      <div className='empty-content'>
                        <p>这篇笔记还没有内容，点击编辑开始书写吧！</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='empty-state'>
              <div className='empty-content'>
                <h3>还没有笔记</h3>
                <p>点击右上角的&qout;新建&qout;按钮创建你的第一篇笔记吧！</p>
                <Button
                  type='primary'
                  size='large'
                  icon={<PlusOutlined />}
                  onClick={() => setShowCreateModal(true)}
                >
                  创建笔记
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 创建笔记模态框 */}
      <Modal
        title='新建笔记'
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={createForm} onFinish={handleCreateNote} layout='vertical'>
          <Form.Item
            label='笔记标题'
            name='title'
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder='请输入笔记标题' />
          </Form.Item>

          <Form.Item>
            <div className='modal-actions'>
              {isCreating ? (
                <Spin />
              ) : (
                <Button type='primary' htmlType='submit'>
                  创建
                </Button>
              )}
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  createForm.resetFields();
                }}
              >
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
