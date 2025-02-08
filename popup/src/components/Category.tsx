import { Flex, Text } from "@radix-ui/themes";
import { navigate, PagesName } from "../slices/navigationSlice";
import { useAppDispatch } from "../hooks/UseReduxType";

export interface CategoryListType {
  icon: any;
  title: string;
}

interface CategoryProps {
  list: CategoryListType[];
  goto: PagesName;
}

const Category = ({ list, goto }: CategoryProps) => {
  const dispatch = useAppDispatch();

  return (
    <Flex direction={"column"} gapY={"1"} mt={"1"}>
      <Flex
        direction={"column"}
        style={{ backgroundColor: "#F2F2F7", borderRadius: "6px" }}
      >
        {list.map((i, index) => (
          <Flex
            style={{
              borderBottom:
                index === list.length - 1 ? "none" : "1px solid #EAEAEA",
              alignItems: "center",
              paddingBlock: 10,
              paddingInline: 18,
              cursor: "default",
            }}
            onClick={() =>
              dispatch(
                navigate({
                  name: goto,
                  title: i.title,
                })
              )
            }
          >
            {/* icon */}
            {i.icon}

            {/* title */}
            <Text size={"1"} weight={"regular"} ml={"3"}>
              {i.title}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Category;
