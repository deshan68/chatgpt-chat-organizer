import AllCollectionsPage from "../pages/AllCollectionsPage";
import HomePage from "../pages/HomePage";
import CollectionsPage from "../pages/CollectionsPage";
import ChatListPage from "../pages/ChatListPage";
import { _Collection, Tag } from "../../../shared/types";

export const screens = {
  HomePage: HomePage,
  AllCollectionsPage: AllCollectionsPage,
  CollectionsPage: CollectionsPage,
  ChatListPage: ChatListPage,
};

export const warningMessage = "Please choose the file before start Drawing";

// collection table

// export const DB: _Collection[] = [
//   {
//     id: "c1",
//     name: "Collection 01",
//     date: "2024-01-12",
//     isFavorite: true,
//     chats: ["f1", "f2"],
//   },
//   {
//     id: "c2",
//     name: "Collection 02",
//     date: "2024-01-12",
//     isFavorite: true,
//     chats: ["f1"],
//   },
//   {
//     id: "c3",
//     name: "Collection 03",
//     date: "2024-01-12",
//     isFavorite: true,
//     chats: ["f1"],
//   },
//   {
//     id: "c5",
//     name: "Root",
//     date: "2024-01-12",
//     isFavorite: false,
//     chats: ["f1"],
//   },
// ];

export const tagList: Tag[] = [
  {
    id: "t1",
    name: "Red",
    colorCode: "#FF453A",
  },
  {
    id: "t2",
    name: "Orange",
    colorCode: "#FF9F0A",
  },
  {
    id: "t3",
    name: "Yellow",
    colorCode: "#FFD60A",
  },
  {
    id: "t4",
    name: "Green",
    colorCode: "#30D158",
  },
  {
    id: "t5",
    name: "Blue",
    colorCode: "#0A84FF",
  },
  {
    id: "t6",
    name: "Purple",
    colorCode: "#BF5AF2",
  },
  {
    id: "t7",
    name: "Gray",
    colorCode: "#8E8E93",
  },
];
