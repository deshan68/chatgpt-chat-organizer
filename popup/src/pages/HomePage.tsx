import { Flex } from "@radix-ui/themes";
import Collections from "../components/Collections";
import RecentFile from "../components/RecentFile";
import HomeHeader from "../components/HomeHeader";
import InvalidUrlMessage from "../components/InvalidUrlMessage";
import { useAppContext } from "../context/AppProvider";

const HomePage = () => {
  const { isValidUrl } = useAppContext();

  if (!isValidUrl) return <InvalidUrlMessage />;

  return (
    <Flex direction="column" gap="2">
      {/* header */}
      <HomeHeader />

      {/* collections */}
      <Collections />

      {/* Recent file */}
      <RecentFile />
    </Flex>
  );
};

export default HomePage;
