import { ApiResponse } from '../types/todo';
import { delay } from '../utils';
import {
  CreateNewNoteParam,
  DeleteNoteParam,
  Note,
  UpdateNoteContentParam,
} from './types';
import { mockNotes } from '../mockdata';
export const getAllNotes = async (): Promise<ApiResponse<Note[]>> => {
  await delay();
  return {
    success: true,
    data: mockNotes,
  };
};

export const updateNoteContent = async (
  param: UpdateNoteContentParam
): Promise<ApiResponse<void>> => {
  await delay();
  mockNotes.forEach(note => {
    if (note.id === param.id) {
      note.content = param.content;
      param.title && (note.title = param.title);
    }
  });
  return {
    success: true,
  };
};

export const createNewNote = async (
  param: CreateNewNoteParam
): Promise<ApiResponse<Note>> => {
  await delay();
  const newNote: Note = {
    id: param.id,
    title: param.title,
    content: param.content,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  mockNotes.push(newNote);
  return {
    success: true,
    data: newNote,
  };
};

export const deleteNote = async (
  param: DeleteNoteParam
): Promise<ApiResponse<void>> => {
  await delay();
  const index = mockNotes.findIndex(note => note.id === param.id);
  mockNotes.splice(index, 1);
  return {
    success: true,
  };
};
