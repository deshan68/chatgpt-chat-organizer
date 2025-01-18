import {
  Flex,
  Text,
  DropdownMenu,
  Dialog,
  Button,
  Spinner,
} from "@radix-ui/themes";
import {
  DotFilledIcon,
  DotsVerticalIcon,
  FileIcon,
} from "@radix-ui/react-icons";
import { File } from "../utils/types";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { sendMessageToContent, setStorage } from "../../../shared/chrome-utils";
import { MessageTypes, STORAGE_KEYS } from "../../../shared/types";
import { deleteFile } from "../slices/fileSlice";
import { useState } from "react";
import {
  addFileToCollection,
  removeFileFromCollection,
  removeFileIdFromCollection,
} from "../slices/collectionSlice";
import { updateCurrentWorkingFileId } from "../slices/configSlice";
import { useConfirmation } from "../context/ConfirmationContext";

const FileCard = ({ file }: { file: File }) => {
  const { showConfirmation } = useConfirmation();
  const dispatch = useAppDispatch();
  const files = useAppSelector((state) => state.file.files);
  const collections = useAppSelector((state) => state.collection.collections);
  const currentWorkingFileId = useAppSelector(
    (state) => state.config.currentWorkingFileId
  );
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );

  const [openCollectionListDialog, setOpenCollectionListDialog] =
    useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddToCollection = async (collectionId: string) => {
    const selectedCollection = collections.map((c) => {
      if (c.id === collectionId) {
        return { ...c, fileIds: [...c.fileIds, file.id] };
      }
      return c;
    });

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(selectedCollection)
    );

    dispatch(addFileToCollection({ fileId: file.id, collectionId }));

    setOpenCollectionListDialog(false);
  };

  const _handleDeleteFile = async () => {
    const updatedFiles = files.filter((f) => f.id !== file.id);
    await setStorage(STORAGE_KEYS.FILE, JSON.stringify(updatedFiles));
    dispatch(deleteFile(file.id));

    const updatedCollections = collections.map((c) =>
      c.fileIds.includes(file.id)
        ? { ...c, fileIds: c.fileIds.filter((id) => id !== file.id) }
        : c
    );
    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );
    dispatch(removeFileIdFromCollection(file.id));

    sendMessageToContent({
      type: MessageTypes.PUSH_CURRENT_WORKING_FILE_NAME,
      body: { fileName: "Please choose the file before start Drawing" },
    });
  };

  const handleRemoveFromCollection = async () => {
    if (!currentScreen?.params?.collectionId) return;

    const updatedCollection = collections.map((c) => {
      if (c.id === currentScreen?.params?.collectionId) {
        return {
          ...c,
          fileIds: c.fileIds.filter((id) => id !== file.id),
        };
      }
      return c;
    });
    dispatch(
      removeFileFromCollection({
        fileId: file.id,
        collectionId: currentScreen?.params?.collectionId,
      })
    );

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollection)
    );
  };

  const isAlreadyAdded = (collectionId: string): boolean => {
    const collectionFileIds = collections.find(
      (c) => c.id === collectionId
    )?.fileIds;

    return collectionFileIds?.includes(file.id) || false;
  };

  const collectionListDialog = () => {
    return (
      <Dialog.Root
        open={openCollectionListDialog}
        onOpenChange={() => {
          setOpenCollectionListDialog((p) => !p);
        }}
      >
        <Dialog.Content maxWidth="170px">
          <Dialog.Description
            style={{ display: "flex", flexDirection: "column" }}
          >
            {collections.map((c) => (
              <Button
                onClick={() => handleAddToCollection(c.id)}
                size="1"
                mb="1"
                variant="soft"
                color="gray"
                disabled={isAlreadyAdded(c.id)}
              >
                {c.name}
              </Button>
            ))}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    );
  };

  const handleClickFileCard = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await setStorage(
        STORAGE_KEYS.CURRENT_WORKING_FILE_ID,
        JSON.stringify(file.id)
      );
      dispatch(updateCurrentWorkingFileId(file.id));

      await sendMessageToContent({
        type: MessageTypes.PUSH_EXCALIDRAW_FILE,
        body: { excalidraw: file.excalidraw },
      });
    } catch (error) {
      console.error(error);
    } finally {
      pushFileName();
    }
  };

  const pushFileName = () => {
    setTimeout(() => {
      sendMessageToContent({
        type: MessageTypes.PUSH_CURRENT_WORKING_FILE_NAME,
        body: { fileName: file.name },
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteFile = () => {
    showConfirmation({
      title: "Delete Item",
      message: "Are you sure you want to delete this item?",
      onConfirm: () => _handleDeleteFile(),
    });
  };

  return (
    <Flex minWidth="100%">
      <Flex
        style={{
          cursor: "pointer",
          width: "100%",
        }}
        onClick={() => handleClickFileCard()}
      >
        <Flex
          style={{
            backgroundColor: "#E6E5FF",
            borderRadius: "30%",
          }}
          p="4"
          position="relative"
        >
          <FileIcon />

          {currentWorkingFileId === file.id && (
            <DotFilledIcon
              width="18"
              height="18"
              style={{ color: "green", position: "absolute", top: 1, right: 1 }}
            />
          )}
        </Flex>

        <Flex direction="column" ml="3" py="1">
          <Text
            size="1"
            weight="bold"
            trim="both"
            style={{
              display: "flex",
            }}
          >
            {file.name}
            {isLoading && <Spinner size="1" ml="3" />}
          </Text>
          <Text size="1" weight="light">
            {file.lastModified}
          </Text>
        </Flex>
      </Flex>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <DotsVerticalIcon
            style={{
              marginLeft: "auto",
              alignSelf: "center",
              cursor: "pointer",
              padding: "2",
            }}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="1" color="gray" variant="soft">
          <DropdownMenu.Item
            disabled={
              (currentScreen?.params ? true : false) ||
              (collections.length === 0 ? true : false)
            }
            onClick={() => setOpenCollectionListDialog(true)}
          >
            Add to collection
          </DropdownMenu.Item>
          <DropdownMenu.Item
            disabled={currentScreen?.params ? false : true}
            onClick={handleRemoveFromCollection}
          >
            Remove from collection
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={handleDeleteFile} color="red">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {collectionListDialog()}
    </Flex>
  );
};

export default FileCard;
