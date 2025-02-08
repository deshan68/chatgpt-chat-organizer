import { Flex, Text } from "@radix-ui/themes";
import FolderIcon from "./icons/FolderIcon";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useAppDispatch } from "../hooks/UseReduxType";
import { navigate, PagesName } from "../slices/navigationSlice";
import { _Collection } from "../constants/constants";

export interface CollectionCardProps {
  title: string;
  date: string;
  items: string;
}
const CollectionCard = ({ id, name, date, chats }: _Collection) => {
  const dispatch = useAppDispatch();

  // const findTagsForCollection = (tags: string[]) => {
  //   return tags
  //     .map((tagId) => tagList.find((tag) => tag.id === tagId))
  //     .filter((tag): tag is Tag => tag !== undefined);
  // };

  return (
    <Flex
      pl="1"
      gapX={"4"}
      style={{
        cursor: "default",
      }}
      onClick={() =>
        dispatch(
          navigate({
            name: PagesName.ChatListPage,
            title: name,
            params: { collectionId: id },
          })
        )
      }
    >
      <Flex justify="between" align="center">
        <FolderIcon />
      </Flex>

      <Flex
        py={"2"}
        align={"center"}
        width={"100%"}
        style={{
          borderBottom: "1px solid #EAEAEA",
        }}
      >
        <Flex direction={"column"}>
          <Text weight="bold" trim="both" style={{ fontSize: 11 }}>
            {name}
          </Text>
          <Text weight="light" style={{ fontSize: 10 }}>
            {date} - {chats.length} item
          </Text>
        </Flex>
        {/* 
        <Flex style={{ marginLeft: "auto" }}>
          {findTagsForCollection(tags).map((t) => (
            <Flex
              style={{
                backgroundColor: t.colorCode,
                height: 10,
                width: 10,
                borderRadius: 5,
                border: "1px solid rgb(255, 255, 255)",
                marginLeft: -3,
              }}
            />
          ))}
        </Flex> */}

        <ChevronRightIcon style={{ marginLeft: "auto" }} color="#87878C" />
      </Flex>
    </Flex>
  );
};

export default CollectionCard;
