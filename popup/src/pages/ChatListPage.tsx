import { CaretDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import ChatCard from "../components/ChatCard";
import { _Collection, Chat, chatList, DB } from "../constants/constants";
import { addAsFavorite } from "../slices/collectionSlice";
import { setStorage } from "../../../shared/chrome-utils";
import { STORAGE_KEYS } from "../../../shared/types";

const ChatListPage = () => {
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const his = useAppSelector((state) => state.navigation.history);
  const collectionId = currentScreen?.params?.collectionId || null;
  const collections = useAppSelector((state) => state.collection.collections);

  const tagId = currentScreen?.params?.tagId || null;

  const getShortTxt = (text: string): string => {
    let shortedTxt = text.slice(0, 13);
    if (text.length > 13) shortedTxt += "...";
    return shortedTxt;
  };

  const getFilesByCollectionId = (): Chat[] => {
    // if (!collectionId) return files;
    const filteredIds = DB.find((c) => c.id === collectionId)?.chats;
    return chatList.filter((c) => filteredIds?.includes(c.id));
  };

  const getChatsByTagId = (): Chat[] => {
    return chatList.filter((c) => c.tags.includes(tagId));
  };

  const getChatList = (): Chat[] => {
    if (collectionId) return getFilesByCollectionId();
    if (tagId) return getChatsByTagId();

    return chatList;
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
            <ChevronLeftIcon color="#00B48C" />
          </Flex>
          <Text
            size="1"
            weight="regular"
            style={{
              color: "#00B48C",
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
