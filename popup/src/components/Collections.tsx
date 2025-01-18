import { Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { navigate, PagesName } from "../slices/navigationSlice";
import CollectionCard from "./CollectionCard";
import EmptyList from "./EmptyList";

const Collections = () => {
  const dispatch = useAppDispatch();
  const collections = useAppSelector((state) => state.collection.collections);

  return (
    <Flex direction="column" gapY="1">
      <Flex justify="between" align="center">
        <Text size="2" weight="bold">
          Collections
        </Text>
        <Text
          size="1"
          weight="light"
          onClick={() =>
            dispatch(
              navigate({
                name: PagesName.AllCollectionsPage,
                title: "All Collections",
              })
            )
          }
          style={{ cursor: "pointer" }}
        >
          See all
        </Text>
      </Flex>

      <Flex gapX="2" overflow="scroll" pb="3">
        {collections.length === 0 && <EmptyList title="collection" />}

        {collections.map((col) => (
          <CollectionCard collection={col} />
        ))}
      </Flex>
    </Flex>
  );
};

export default Collections;
