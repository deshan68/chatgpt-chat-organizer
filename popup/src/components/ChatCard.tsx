import { Dialog, DropdownMenu, Flex, IconButton, Text } from "@radix-ui/themes";
import {
  Cross2Icon,
  DotFilledIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import { tagList } from "../constants/constants";
import { MessageTypes, Tag } from "../../../shared/types";
import { useState } from "react";
import UseDatabase from "../hooks/UseDatabase";
import { useConfirmation } from "../context/ConfirmationContext";
import { sendMessageToContent } from "../../../shared/chrome-utils";
interface ChatCardProps {
  id: string;
  name: string;
  tags: string[];
  date: string;
  chatUrl: string;
}
const ChatCard = ({ id, name, tags, date, chatUrl }: ChatCardProps) => {
  const { insertTagToChat, deleteChat } = UseDatabase();
  const { showConfirmation } = useConfirmation();
  const [openTagListModal, setOpenTagListModal] = useState(false);

  const findTagsForCollection = (tags: string[]) => {
    return tags
      .map((tagId) => tagList.find((tag) => tag.id === tagId))
      .filter((tag): tag is Tag => tag !== undefined);
  };

  const handleTagClick = (tagId: string) => {
    insertTagToChat(tagId, id);
  };

  const handleDeleteChat = () => {
    showConfirmation({
      title: "Delete Chat",
      message: "Are you sure you want to delete this chat?",
      onConfirm: () => deleteChat(id),
    });
  };

  const TagListModal = () => {
    return (
      <Dialog.Root open={openTagListModal} onOpenChange={setOpenTagListModal}>
        <Dialog.Content width={"170px"} style={{ borderRadius: "2%" }}>
          {tagList.map((i, index) => (
            <Flex
              style={{
                borderBottom:
                  index === tagList.length - 1 ? "none" : "1px solid #EAEAEA",
                alignItems: "center",
                paddingBlock: 6,
                paddingInline: 10,
                cursor: "pointer",
              }}
              onClick={() => handleTagClick(i.id)}
            >
              {/* icon */}
              <DotFilledIcon
                color={i.colorCode}
                style={{ backgroundColor: i.colorCode, borderRadius: 20 }}
                height={8}
                width={8}
              />

              {/* title */}
              <Text size={"1"} weight={"regular"} ml={"3"}>
                {i.name}
              </Text>

              {/* close icon for remove tag */}
              {tags.includes(i.id) && (
                <IconButton size={"1"} variant="soft" color="gray" ml="auto">
                  <Cross2Icon height={12} width={12} />
                </IconButton>
              )}
            </Flex>
          ))}
        </Dialog.Content>
      </Dialog.Root>
    );
  };

  const handleNavigateToChat = async (chatUrl: string) => {
    await sendMessageToContent({
      type: MessageTypes.NAVIGATE_TO_CHAT,
      body: { chatUrl },
    });
  };

  return (
    <Flex pl="1" gapX={"4"}>
      <Flex
        py={"2"}
        align={"center"}
        width={"100%"}
        style={{
          borderBottom: "1px solid #EAEAEA",
          cursor: "pointer",
        }}
        onClick={() => handleNavigateToChat(chatUrl)}
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
      </Flex>
      <TagListModal />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger style={{ padding: 6, cursor: "pointer" }}>
          <DotsVerticalIcon color={"#87878C"} height={10} width={10} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="1" color="gray" variant="soft">
          <DropdownMenu.Item onClick={() => setOpenTagListModal(true)}>
            Add Tag
          </DropdownMenu.Item>
          <DropdownMenu.Item color="red" onClick={() => handleDeleteChat()}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default ChatCard;
