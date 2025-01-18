import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import FileCard from "../components/FileCard";
import { File } from "../utils/types";
import EmptyList from "../components/EmptyList";

const AllFilesPage = () => {
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const collectionId = currentScreen?.params?.collectionId || null;
  const files = useAppSelector((state) => state.file.files);
  const Collections = useAppSelector((state) => state.collection.collections);

  const dispatch = useAppDispatch();

  const getFilesByCollectionId = (): File[] => {
    if (!collectionId) return files;
    const filteredIds = Collections.find((c) => c.id === collectionId)?.fileIds;
    return files.filter((f) => filteredIds?.includes(f.id));
  };

  if (!currentScreen) {
    return <div>No screen to display</div>;
  }

  return (
    <Flex direction="column">
      {/* header */}
      <Flex my="3" justify="between" align="center">
        <Flex gapX="2" align="center">
          <Flex
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(goBack())}
          >
            <ChevronLeftIcon />
          </Flex>
          <Text size="4" weight="bold">
            {currentScreen.title}
          </Text>
        </Flex>
      </Flex>
      <Flex gapY="2" direction={"column"}>
        {getFilesByCollectionId().length === 0 && <EmptyList title="file" />}

        {getFilesByCollectionId().map((file) => (
          <FileCard file={file} />
        ))}
      </Flex>
    </Flex>
  );
};

export default AllFilesPage;
