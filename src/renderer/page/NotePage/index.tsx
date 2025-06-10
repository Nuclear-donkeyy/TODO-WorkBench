import React, { useState, useEffect } from 'react';
import { Button, Select, Input, message, Modal, Form } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import './index.less';

const { TextArea } = Input;
const { Option } = Select;

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotePage(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: '我的第一篇笔记',
        content:
          '这是一篇示例笔记，你可以在这里记录你的想法和灵感。\n\n支持多行编辑，可以记录详细的内容。',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        title: '今日待办',
        content:
          '1. 完成项目文档\n2. 准备明天的会议\n3. 回复重要邮件\n4. 整理桌面文件',
        createdAt: '2024-01-16',
        updatedAt: '2024-01-16',
      },
    ];
    setNotes(sampleNotes);
    if (sampleNotes.length > 0) {
      setCurrentNoteId(sampleNotes[0].id);
      setCurrentNote(sampleNotes[0]);
      setEditContent(sampleNotes[0].content);
    }
  }, []);

  // 切换笔记
  const handleNoteChange = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNoteId(noteId);
      setCurrentNote(note);
      setEditContent(note.content);
      setIsEditing(false);
    }
  };

  // 开始编辑
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (currentNote) {
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
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    if (currentNote) {
      setEditContent(currentNote.content);
    }
    setIsEditing(false);
  };

  // 新建笔记
  const handleCreateNote = async (values: { title: string }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: values.title,
      content: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setCurrentNoteId(newNote.id);
    setCurrentNote(newNote);
    setEditContent('');
    setIsEditing(true);
    setShowCreateModal(false);
    createForm.resetFields();
    message.success('笔记创建成功');
  };

  // 删除笔记
  const handleDeleteNote = () => {
    if (!currentNote) return;

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除笔记"${currentNote.title}"吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const updatedNotes = notes.filter(note => note.id !== currentNote.id);
        setNotes(updatedNotes);

        if (updatedNotes.length > 0) {
          const nextNote = updatedNotes[0];
          setCurrentNoteId(nextNote.id);
          setCurrentNote(nextNote);
          setEditContent(nextNote.content);
        } else {
          setCurrentNoteId(null);
          setCurrentNote(null);
          setEditContent('');
        }
        setIsEditing(false);
        message.success('笔记删除成功');
      },
    });
  };

  return (
    <div className='note-page-container'>
      {/* 工具栏 */}
      <div className='note-toolbar'>
        <div className='toolbar-left'>
          <Select
            placeholder='选择笔记'
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
              <Button type='primary' htmlType='submit'>
                创建
              </Button>
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
