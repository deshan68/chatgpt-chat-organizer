import { Button, Dialog, Flex } from "@radix-ui/themes";
import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import Category, { CategoryListType } from "../components/Category";
import { LaptopIcon } from "@radix-ui/react-icons";
import { PagesName } from "../slices/navigationSlice";
import FavoriteSection from "../components/FavoriteSection";
import TagsSection from "../components/TagsSection";
import { _Collection, DB } from "../constants/constants";
import {
  getAllKeys,
  getAllStorage,
  getStorage,
  removeStorage,
} from "../../../shared/chrome-utils";
import { STORAGE_KEYS } from "../../../shared/types";

const lst1: CategoryListType[] = [
  {
    icon: <LaptopIcon color="#00B48C" />,
    title: "All Collections",
  },
];

const HomePage = () => {
  const clear = async () => {
    const keys = await getAllKeys();
    await removeStorage(keys);
  };

  const show = async () => {
    const allStorage = await getAllStorage();
    console.log("allStorage", allStorage);
    
    const e = await getStorage<_Collection[]>(STORAGE_KEYS.COLLECTION);
    console.log("e", e);
  };

  return (
    <Flex direction="column" gap="2" style={{ height: "100%" }}>
      <HomeHeader />
      <SearchBar />

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
          backgroundColor: "#00B48C",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
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
          backgroundColor: "#00B48C",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
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
              backgroundColor: "#00B48C",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            Save Chat
          </Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth={"200px"} style={{ borderRadius: "3%" }}>
          <Flex direction="column">
            {DB.map((t) => (
              <Button
                // onClick={() => handleAddToCollection(c.id)}
                size="1"
                mb="1"
                variant="soft"
                color="gray"
                // disabled={isAlreadyAdded(c.id)}
              >
                {t.name}
              </Button>
            ))}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default HomePage;
