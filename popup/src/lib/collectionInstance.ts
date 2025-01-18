import { Collection } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

export class CollectionInstance {
  id: string;
  name: string;
  fileIds: string[];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.fileIds = [];
  }

  public getCollection(): Collection {
    return {
      id: this.id,
      name: this.name,
      fileIds: this.fileIds,
    };
  }
}
