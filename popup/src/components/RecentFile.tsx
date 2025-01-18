import { Flex, Text } from "@radix-ui/themes";
import FileCard from "./FileCard";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { navigate, PagesName } from "../slices/navigationSlice";
import EmptyList from "./EmptyList";

const RecentFile = () => {
  const dispatch = useAppDispatch();
  const files = useAppSelector((state) => state.file.files);

  return (
    <Flex direction="column">
      <Flex justify="between" align="center">
        <Text size="2" weight="bold">
          Recent
        </Text>
        <Text
          size="1"
          weight="light"
          onClick={() =>
            dispatch(
              navigate({ name: PagesName.AllFilesPage, title: "All Files" })
            )
          }
          style={{ cursor: "pointer" }}
        >
          See all
        </Text>
      </Flex>

      <Flex gapY="2" direction={"column"}>
        {files.length === 0 && <EmptyList title="file" />}
        {files.map((file) => (
          <FileCard file={file} />
        ))}
      </Flex>
    </Flex>
  );
};

export default RecentFile;
