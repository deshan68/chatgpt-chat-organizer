import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  RadioGroup,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { sendMessageToContent, setStorage } from "../../../shared/chrome-utils";
import { MessageTypes, STORAGE_KEYS } from "../../../shared/types";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { addCollection } from "../slices/collectionSlice";
import { addFile } from "../slices/fileSlice";
import { CollectionInstance } from "../lib/collectionInstance";
import { FileInstance } from "../lib/fileCollection";
import { updateCurrentWorkingFileId } from "../slices/configSlice";
import { DRAWING_TYPE } from "../utils/types";

const HomeHeader = () => {
  const collections = useAppSelector((state) => state.collection.collections);
  const files = useAppSelector((state) => state.file!.files);
  const dispatch = useAppDispatch();
  const [collectionName, setCollectionName] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] =
    useState<boolean>(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [drawingType, setDrawingType] = useState(DRAWING_TYPE.NEW_DRAWING);

  const handleCreateCollection = async () => {
    if (collectionName.trim().length === 0) return;

    const collection = new CollectionInstance(collectionName);

    const updatedCollections = [...collections, collection.getCollection()];

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(addCollection(collection.getCollection()));

    setIsCollectionDialogOpen(false);
    setCollectionName("");
  };

  const handleCreateFile = async () => {
    if (fileName.trim().length === 0) return;

    try {
      setIsLoading(true);
      let excalidrawFile: any[];

      if (drawingType === DRAWING_TYPE.NEW_DRAWING) {
        excalidrawFile = [];
      } else {
        excalidrawFile =
          (await sendMessageToContent({
            type: MessageTypes.LOAD_EXCALIDRAW_FILE,
          })) || [];
      }

      const file = new FileInstance(fileName, excalidrawFile);
      const updatedFiles = [...files, file.getFile()];
      await setStorage(STORAGE_KEYS.FILE, JSON.stringify(updatedFiles));
      dispatch(addFile(file.getFile()));

      await setStorage(
        STORAGE_KEYS.CURRENT_WORKING_FILE_ID,
        JSON.stringify(file.getFile().id)
      );
      dispatch(updateCurrentWorkingFileId(file.getFile().id));

      if (drawingType === DRAWING_TYPE.NEW_DRAWING) {
        await sendMessageToContent({
          type: MessageTypes.PUSH_EXCALIDRAW_FILE,
          body: { excalidraw: [] },
        });
      }
    } catch (error) {
      throw Error("Error while creating file");
    } finally {
      pushFileName(fileName);
    }
  };

  const pushFileName = (fileName: string) => {
    setTimeout(() => {
      sendMessageToContent({
        type: MessageTypes.PUSH_CURRENT_WORKING_FILE_NAME,
        body: { fileName: fileName },
      });
      setIsLoading(false);
      setIsFileDialogOpen(false);
      setFileName("");
      setDrawingType(DRAWING_TYPE.NEW_DRAWING);
    }, 1500);
  };

  return (
    <Flex my="3" justify="between">
      <Flex direction="column">
        <Text size="5" weight="bold" trim="both">
          Excalidraw
        </Text>
        <Text size="1" weight="light">
          File Manager
        </Text>
      </Flex>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Flex
            style={{
              backgroundColor: "#E6E5FF",
              borderRadius: "100%",
              cursor: "pointer",
            }}
            p="2"
            justify="center"
            align="center"
          >
            <PlusIcon />
          </Flex>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="1" color="gray" variant="soft">
          {/* Dialog for "Create File" */}
          <Dialog.Root open={isFileDialogOpen}>
            <Dialog.Trigger>
              <DropdownMenu.Item
                onClick={(e) => {
                  e.preventDefault();
                  setIsFileDialogOpen(true);
                }}
              >
                File
              </DropdownMenu.Item>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="450px">
              <Flex direction="column" gapY="2">
                <label>
                  <Text size="1" mb="1">
                    File Name
                  </Text>
                  <TextField.Root
                    size="1"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => {
                      if (e.target.value.length <= 35) {
                        setFileName(e.target.value);
                      }
                    }}
                  />
                </label>

                <RadioGroup.Root defaultValue="1" name="drawingType" size="1">
                  <RadioGroup.Item
                    onClick={() => setDrawingType(DRAWING_TYPE.NEW_DRAWING)}
                    value={DRAWING_TYPE.NEW_DRAWING}
                  >
                    New Drawing
                  </RadioGroup.Item>
                  <RadioGroup.Item
                    value={DRAWING_TYPE.DUPLICATE}
                    onClick={() => setDrawingType(DRAWING_TYPE.DUPLICATE)}
                  >
                    Duplicate
                  </RadioGroup.Item>
                </RadioGroup.Root>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Button
                  variant="soft"
                  color="gray"
                  size="1"
                  onClick={() => setIsFileDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="1"
                  onClick={handleCreateFile}
                  disabled={isLoading}
                >
                  Create
                  {isLoading && <Spinner size="1" />}
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          {/* Dialog for "Create Collection" */}
          <Dialog.Root open={isCollectionDialogOpen}>
            <Dialog.Trigger>
              <DropdownMenu.Item
                onClick={(e) => {
                  e.preventDefault();
                  setIsCollectionDialogOpen(true);
                }}
              >
                Collection
              </DropdownMenu.Item>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="450px">
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1">
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
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default HomeHeader;
