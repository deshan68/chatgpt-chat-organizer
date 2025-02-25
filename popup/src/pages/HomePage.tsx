import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import HomeHeader from "../components/HomeHeader";
import Category, { CategoryListType } from "../components/Category";
import { ChatBubbleIcon, LaptopIcon } from "@radix-ui/react-icons";
import { PagesName } from "../slices/navigationSlice";
import FavoriteSection from "../components/FavoriteSection";
import TagsSection from "../components/TagsSection";
import {
  getAllKeys,
  getAllStorage,
  getStorage,
  removeStorage,
} from "../../../shared/chrome-utils";
import { _Collection, Chat, STORAGE_KEYS } from "../../../shared/types";
import { useAppSelector } from "../hooks/UseReduxType";
import { useAppContext } from "../context/AppProvider";
import InvalidUrlMessage from "../components/InvalidUrlMessage";
import UseDatabase from "../hooks/UseDatabase";

const HomePage = () => {
  const { isValidUrl } = useAppContext();
  const { filteredCollections, insertChat } = UseDatabase();

  const themeColor = useAppSelector((state) => state.config.themeColor);

  const lst1: CategoryListType[] = [
    {
      icon: <LaptopIcon color={themeColor} />,
      title: "All Collections",
    },
    {
      icon: <ChatBubbleIcon color={themeColor} />,
      title: "All Chats",
    },
  ];

  const clear = async () => {
    const keys = await getAllKeys();
    await removeStorage(keys);
  };

  const show = async () => {
    const allStorage = await getAllStorage();
    console.log("allStorage", allStorage);

    const chats = await getStorage<Chat[]>(STORAGE_KEYS.CHAT);
    const coll = await getStorage<_Collection[]>(STORAGE_KEYS.COLLECTION);
    console.log("chats", chats);
    console.log("coll", coll);
  };

  if (!isValidUrl) return <InvalidUrlMessage />;

  return (
    <Flex direction="column" gap="2" style={{ height: "100%" }}>
      <HomeHeader />
      {/* <SearchBar /> */}

      <Flex
        direction="column"
        px="4"
        pb="4"
        style={{
          overflowY: "scroll",
          height: "500px",
        }}
      >
        <Category list={lst1} goto={PagesName.CollectionsPage} />
        <FavoriteSection />
        <TagsSection />
      </Flex>

      <Button
        size={"2"}
        radius="full"
        style={{
          position: "absolute",
          bottom: 75,
          left: 15,
          fontSize: "10px",
          paddingInline: "20px",
          paddingBlock: "8px",
          backgroundColor: themeColor,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          // display: "none",
        }}
        onClick={() => show()}
      >
        Show
      </Button>
      <Button
        size={"2"}
        radius="full"
        style={{
          position: "absolute",
          bottom: 25,
          left: 15,
          fontSize: "10px",
          paddingInline: "20px",
          paddingBlock: "8px",
          backgroundColor: themeColor,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          // display: "none",
        }}
        onClick={() => clear()}
      >
        Clear
      </Button>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button
            size={"2"}
            radius="full"
            style={{
              position: "absolute",
              bottom: 25,
              right: 15,
              fontSize: "10px",
              paddingInline: "20px",
              paddingBlock: "8px",
              backgroundColor: themeColor,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            Save Chat
          </Button>
        </Dialog.Trigger>
        <Dialog.Content
          maxWidth={"260px"}
          style={{ borderRadius: "6px", maxHeight: "380px", overflowY: "auto" }}
        >
          <Flex direction="column">
            {filteredCollections.map((c) => (
              <Text
                size={"1"}
                onClick={() => insertChat(c.id)}
                mb="1"
                style={{
                  cursor: "pointer",
                  paddingInline: 10,
                  paddingBlock: 5,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EAEAEA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {c.name}
              </Text>
            ))}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default HomePage;
