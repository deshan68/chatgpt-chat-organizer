import { Flex } from "@radix-ui/themes";
import { useAppSelector } from "../hooks/UseReduxType";

const AllCollectionsPage = () => {
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );

  if (!currentScreen) {
    return <div>No screen to display</div>;
  }

  return <Flex direction="column"></Flex>;
};

export default AllCollectionsPage;
