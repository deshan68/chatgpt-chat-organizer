import { Checkbox, Flex, Text } from "@radix-ui/themes";
import FolderIcon from "./icons/FolderIcon";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { navigate, PagesName } from "../slices/navigationSlice";
import { Collection } from "../utils/types";

const CollectionCard = ({
  collection,
  selectedCollections,
  toggleSelection,
}: {
  collection: Collection;
  selectedCollections?: string[];
  toggleSelection?: (collectionId: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelection && toggleSelection(collection.id);
  };

  const handleCardClick = () => {
    dispatch(
      navigate({
        name: PagesName.AllFilesPage,
        title: collection.name,
        params: { collectionId: collection.id },
      })
    );
  };

  const isSelected =
    selectedCollections && selectedCollections.includes(collection.id);

  return (
    <Flex
      justify="between"
      direction="column"
      minHeight="100px"
      minWidth="100px"
      maxHeight="100px"
      maxWidth="100px"
      style={{
        backgroundColor: "#E6E5FF",
        borderRadius: "20%",
        cursor: "pointer",
      }}
      p="3"
      onClick={handleCardClick}
    >
      <Flex justify="between" align="center">
        <FolderIcon />
        {currentScreen?.name === PagesName.AllCollectionsPage && (
          <Checkbox
            size="1"
            checked={isSelected}
            onClick={handleCheckboxClick}
          />
        )}
      </Flex>

      <Flex direction="column">
        <Text size="1" weight="bold" trim="both">
          {collection.name}
        </Text>
        <Text size="1" weight="light">
          {collection.fileIds.length === 0 ? "0" : collection.fileIds.length}
          &nbsp;items
        </Text>
      </Flex>
    </Flex>
  );
};

export default CollectionCard;
