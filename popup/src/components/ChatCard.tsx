import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Chat, Tag, tagList } from "../constants/constants";

const ChatCard = ({ name, tags, date }: Chat) => {
  const findTagsForCollection = (tags: string[]) => {
    return tags
      .map((tagId) => tagList.find((tag) => tag.id === tagId))
      .filter((tag): tag is Tag => tag !== undefined);
  };

  return (
    <Flex
      pl="1"
      gapX={"4"}
      style={{
        cursor: "default",
      }}
    >
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
            {date}
          </Text>
        </Flex>

        <Flex style={{ marginLeft: "auto", marginRight: 2 }}>
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
        </Flex>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <DotsVerticalIcon color={"#87878C"} height={10} width={10} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size="1" color="gray" variant="soft">
            <DropdownMenu.Item>Tag</DropdownMenu.Item>
            <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
};

export default ChatCard;
