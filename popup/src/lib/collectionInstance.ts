import { _Collection } from "../constants/constants";
import { v4 as uuidv4 } from "uuid";

export class CollectionInstance {
  id: string;
  name: string;
  chats: string[];
  isFavorite: boolean;
  date: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.isFavorite = false;
    this.date = new Date().toLocaleString();
    this.chats = [];
  }

  public getCollection(): _Collection {
    return {
      id: this.id,
      name: this.name,
      chats: this.chats,
      date: this.date,
      isFavorite: this.isFavorite,
    };
  }
}
