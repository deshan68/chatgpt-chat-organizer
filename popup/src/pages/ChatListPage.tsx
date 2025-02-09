import { CaretDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import ChatCard from "../components/ChatCard";
import { addAsFavorite } from "../slices/collectionSlice";
import { setStorage } from "../../../shared/chrome-utils";
import { Chat, STORAGE_KEYS } from "../../../shared/types";
import { getFilteredCollection } from "../utils/utils";

const ChatListPage = () => {
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const his = useAppSelector((state) => state.navigation.history);
  const collectionId = currentScreen?.params?.collectionId || null;
  const urlType = useAppSelector((state) => state.config.urlType);
  const chats = useAppSelector((state) => state.chat.chats);
  const collections = getFilteredCollection(
    useAppSelector((state) => state.collection.collections),
    urlType
  );
  const themeColor = useAppSelector((state) => state.config.themeColor);

  const tagId = currentScreen?.params?.tagId || null;

  const getShortTxt = (text: string): string => {
    let shortedTxt = text.slice(0, 13);
    if (text.length > 13) shortedTxt += "...";
    return shortedTxt;
  };

  const getFilesByCollectionId = (): Chat[] => {
    const filteredIds = collections.find((c) => c.id === collectionId)?.chats;
    console.log("filteredIds", filteredIds);
    const filteredChats = chats.filter((c) => filteredIds?.includes(c.id));
    console.log("chatList", filteredChats);
    return filteredChats;
  };

  const getChatsByTagId = (): Chat[] => {
    return chats.filter((c) => c.tags.includes(tagId));
  };

  const getChatList = (): Chat[] => {
    console.log("collectionId", collectionId);
    console.log("tagId", tagId);
    if (collectionId) return getFilesByCollectionId();
    if (tagId) return getChatsByTagId();

    return chats;
  };

  const handleFavorite = async () => {
    dispatch(addAsFavorite({ collectionId }));
    const updatedCollections = collections.map((c) => {
      if (c.id === collectionId) {
        return {
          ...c,
          isFavorite: !c.isFavorite,
        };
      }
      return c;
    });

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );
  };

  const getFavoriteStatus = (): boolean => {
    const isFavorite = collections.find(
      (c) => c.id === collectionId
    )!.isFavorite;
    return isFavorite;
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
                <DropdownMenu.Item>Save Current Chat</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleFavorite()}>
                  {getFavoriteStatus() ? "Remove From Favorite" : "Favorite"}
                </DropdownMenu.Item>
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
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
