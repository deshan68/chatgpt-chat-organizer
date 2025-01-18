import { Text } from "@radix-ui/themes";
import { useAppSelector } from "../hooks/UseReduxType";

interface NavigationProps {
  screens: Record<string, React.ComponentType<any>>;
}

const Navigator: React.FC<NavigationProps> = ({ screens }) => {
  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );

  if (!currentScreen) {
    return <Text>No screen to display</Text>;
  }

  const ScreenComponent = screens[currentScreen.name];

  return <ScreenComponent {...currentScreen.params} />;
};

export default Navigator;
