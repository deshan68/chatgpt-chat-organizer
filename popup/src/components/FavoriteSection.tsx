import { Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { navigate, PagesName } from "../slices/navigationSlice";
import { HeartIcon } from "@radix-ui/react-icons";
import { getFilteredCollection } from "../utils/utils";
import UseDatabase from "../hooks/UseDatabase";

const FavoriteSection = () => {
  const dispatch = useAppDispatch();

  const { collections } = UseDatabase();

  const urlType = useAppSelector((state) => state.config.urlType);
  const themeColor = useAppSelector((state) => state.config.themeColor);

  const getFavCollections = () => {
    return getFilteredCollection(collections, urlType).filter(
      (f) => f.isFavorite === true
    );
  };

  if (getFavCollections().length === 0) return null;

  return (
    <Flex direction={"column"} gapY={"1"} mt={"1"}>
      <Text size="1" weight="medium">
        Favorite
      </Text>
      <Flex
        direction={"column"}
        style={{
          backgroundColor: "#F2F2F7",
          borderRadius: "6px",
        }}
      >
        {getFavCollections().map((i, index) => (
          <Flex
            style={{
              borderBottom:
                index === getFavCollections().length - 1
                  ? "none"
                  : "1px solid #EAEAEA",
              alignItems: "center",
              paddingBlock: 10,
              paddingInline: 18,
              cursor: "default",
            }}
            onClick={() =>
              dispatch(
                navigate({
                  name: PagesName.ChatListPage,
                  title: i.name,
                  params: { collectionId: i.id },
                })
              )
            }
          >
            {/* icon */}
            <HeartIcon color={themeColor} />

            {/* title */}
            <Text size={"1"} weight={"regular"} ml={"3"}>
              {i.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default FavoriteSection;
