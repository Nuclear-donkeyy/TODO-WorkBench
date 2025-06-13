export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNoteContentParam {
  id: string;
  title?: string;
  content: string;
}

export interface CreateNewNoteParam {
  id: string;
  title: string;
  content: string;
}

export interface DeleteNoteParam {
  id: string;
}
