export interface File {
  id: string;
  name: string;
  lastModified: string;
  excalidraw: any[] | [];
}

export interface Collection {
  id: string;
  name: string;
  fileIds: string[];
}

export enum DRAWING_TYPE {
  NEW_DRAWING = "1",
  DUPLICATE = "2",
}
