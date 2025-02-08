import { Flex, Text } from "@radix-ui/themes";
import { useAppDispatch } from "../hooks/UseReduxType";
import { tagList } from "../constants/constants";
import { navigate, PagesName } from "../slices/navigationSlice";
import { DotFilledIcon } from "@radix-ui/react-icons";

const TagsSection = () => {
  const dispatch = useAppDispatch();

  return (
    <Flex direction={"column"} gapY={"1"} mt={"1"}>
      <Text size="2" weight="regular">
        Tags
      </Text>
      <Flex
        direction={"column"}
        style={{ backgroundColor: "#F2F2F7", borderRadius: "6px" }}
      >
        {tagList.map((i, index) => (
          <Flex
            style={{
              borderBottom:
                index === tagList.length - 1 ? "none" : "1px solid #EAEAEA",
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
                  params: { tagId: i.id },
                })
              )
            }
          >
            {/* icon */}
            <DotFilledIcon
              color={i.colorCode}
              style={{ backgroundColor: i.colorCode, borderRadius: 20 }}
              height={8}
              width={8}
            />

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

export default TagsSection;
