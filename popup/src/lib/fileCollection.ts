import { File } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

export class FileInstance {
  id: string;
  name: string;
  lastModified: string;
  excalidraw: any[] | [];

  constructor(name: string, excalidraw: any[] | []) {
    this.id = uuidv4();
    this.name = name;
    this.lastModified = new Date().toLocaleString();
    this.excalidraw = excalidraw;
  }

  public getFile(): File {
    return {
      id: this.id,
      name: this.name,
      lastModified: this.lastModified,
      excalidraw: this.excalidraw,
    };
  }
}
