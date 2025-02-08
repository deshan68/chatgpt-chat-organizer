import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import { ChevronLeftIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import CollectionCard from "../components/CollectionCard";
import { _Collection } from "../constants/constants";
import { useState } from "react";
import { setStorage } from "../../../shared/chrome-utils";
import { STORAGE_KEYS } from "../../../shared/types";
import { CollectionInstance } from "../lib/collectionInstance";
import { addCollection } from "../slices/collectionSlice";

const CollectionsPage = () => {
  const dispatch = useAppDispatch();

  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const collections = useAppSelector((state) => state.collection.collections);
  const his = useAppSelector((state) => state.navigation.history);

  const [collectionName, setCollectionName] = useState<string>("");
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] =
    useState<boolean>(false);

  const handleCreateCollection = () => {
    handleAddHandle();
    setIsCollectionDialogOpen(false);
  };

  const handleAddHandle = async () => {
    const collection = new CollectionInstance(collectionName);

    const updatedCollections = [...collections, collection.getCollection()];

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(addCollection(collection.getCollection()));
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
        <Text
          size="1"
          weight="regular"
          style={{ flex: 1, textAlign: "center" }}
        >
          {currentScreen.title}
        </Text>

        <Flex
          style={{
            flex: 1,
            justifyContent: "end",
          }}
        >
          {currentScreen.title === "All Collections" && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <DotsHorizontalIcon
                  style={{
                    backgroundColor: "#ffff",
                    borderRadius: 10,
                    padding: 1,
                    border: "0.5px solid #00B48C",
                  }}
                  color="#00B48C"
                  height={12}
                  width={12}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="1" color="gray" variant="soft">
                <DropdownMenu.Item
                  onClick={() => setIsCollectionDialogOpen(true)}
                >
                  New Collection
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>
      </Flex>

      <Flex gapY="2" direction={"column"}>
        {collections.map((l) => (
          <CollectionCard
            id={l.id}
            name={l.name}
            chats={l.chats}
            date={l.date}
            isFavorite={l.isFavorite}
            key={l.id}
          />
        ))}
      </Flex>

      <Dialog.Root open={isCollectionDialogOpen}>
        <Dialog.Content maxWidth="450px">
          <Flex direction="column" gap="3">
            <label>
              <Text size="1" mb="1">
                Collection Name
              </Text>
              <TextField.Root
                size="1"
                placeholder="Enter collection name"
                value={collectionName}
                onChange={(e) => {
                  if (e.target.value.length <= 12) {
                    setCollectionName(e.target.value);
                  }
                }}
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button
              variant="soft"
              color="gray"
              size="1"
              onClick={() => setIsCollectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="1" onClick={handleCreateCollection}>
              Create
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default CollectionsPage;
