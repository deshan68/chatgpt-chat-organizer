import { v4 as uuidv4 } from "uuid";
import { _Collection, CollectionType } from "../../../shared/types";

export class CollectionInstance {
  id: string;
  name: string;
  chats: string[];
  isFavorite: boolean;
  date: string;
  collectionType: CollectionType;

  constructor(name: string, collectionType: CollectionType) {
    this.id = uuidv4();
    this.name = name;
    this.isFavorite = false;
    this.date = new Date().toLocaleString();
    this.chats = [];
    this.collectionType = collectionType;
  }

  public getCollection(): _Collection {
    return {
      id: this.id,
      name: this.name,
      chats: this.chats,
      date: this.date,
      isFavorite: this.isFavorite,
      collectionType: this.collectionType,
    };
  }
}
