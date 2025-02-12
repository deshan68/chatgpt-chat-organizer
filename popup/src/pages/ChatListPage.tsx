import { CaretDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import ChatCard from "../components/ChatCard";
import { Chat } from "../../../shared/types";
import { isCurrentChatFound } from "../utils/utils";
import UseDatabase from "../hooks/UseDatabase";
import { useConfirmation } from "../context/ConfirmationContext";

const ChatListPage = () => {
  const dispatch = useAppDispatch();

  const {
    chats,
    filteredCollections,
    insertChat,
    setAsFavorite,
    deleteCollection,
  } = UseDatabase();
  const { showConfirmation } = useConfirmation();

  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const his = useAppSelector((state) => state.navigation.history);
  const collectionId = currentScreen?.params?.collectionId || null;
  const currentChatDetails = useAppSelector(
    (state) => state.config.currentChatDetails
  );

  const themeColor = useAppSelector((state) => state.config.themeColor);
  const tagId = currentScreen?.params?.tagId || null;

  const getShortTxt = (text: string): string => {
    let shortedTxt = text.slice(0, 13);
    if (text.length > 13) shortedTxt += "...";
    return shortedTxt;
  };

  const getFilesByCollectionId = (): Chat[] => {
    const filteredIds = filteredCollections.find(
      (c) => c.id === collectionId
    )?.chats;
    const filteredChats = chats.filter((c) => filteredIds?.includes(c.id));
    return filteredChats;
  };

  const getChatsByTagId = (): Chat[] => {
    return chats.filter((c) => c.tags.includes(tagId));
  };

  const getChatList = (): Chat[] => {
    if (collectionId) return getFilesByCollectionId();
    if (tagId) return getChatsByTagId();

    return chats;
  };

  const getFavoriteStatus = (): boolean => {
    const isFavorite = filteredCollections.find(
      (c) => c.id === collectionId
    )!.isFavorite;
    return isFavorite;
  };

  const handleDeleteCollection = () => {
    showConfirmation({
      title: "Delete Collection",
      message: "Are you sure you want to delete this collection?",
      onConfirm: () => {
        deleteCollection(collectionId);
        dispatch(goBack());
      },
    });
  };

  if (!currentScreen) {
    return <div>No screen to display</div>;
  }
  return (
    <Flex direction="column" px="4">
      {/* header */}
      <Flex my="4" justify={"center"} align={"center"}>
        <Flex
          onClick={() => dispatch(goBack())}
          style={{ cursor: "pointer", flex: 1 }}
          gapX="1"
          align="center"
        >
          <Flex>
            <ChevronLeftIcon color={themeColor} />
          </Flex>
          <Text
            size="1"
            weight="regular"
            style={{
              color: themeColor,
            }}
          >
            {his[his.length - 1].title}
          </Text>
        </Flex>

        <Flex
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            columnGap: 3,
          }}
        >
          <Text size="1" weight="regular" style={{ textAlign: "center" }}>
            {getShortTxt(currentScreen.title)}
          </Text>
          {collectionId && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <CaretDownIcon
                  style={{ backgroundColor: "#E3E3E8", borderRadius: 10 }}
                  height={12}
                  width={12}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="1" color="gray" variant="soft">
                <DropdownMenu.Item>Rename</DropdownMenu.Item>
                <DropdownMenu.Item
                  disabled={!isCurrentChatFound(currentChatDetails)}
                  onClick={() => insertChat(collectionId)}
                >
                  Save Current Chat
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => setAsFavorite(collectionId)}>
                  {getFavoriteStatus() ? "Remove From Favorite" : "Favorite"}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleDeleteCollection()}
                  color="red"
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>

        <Flex style={{ flex: 1, height: 3 }} />
      </Flex>

      <Flex gapY="2" direction={"column"}>
        {getChatList().map((c) => (
          <ChatCard id={c.id} date={c.date} name={c.name} tags={c.tags} />
        ))}
      </Flex>
    </Flex>
  );
};

export default ChatListPage;
