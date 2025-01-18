import { Text } from "@radix-ui/themes";

const EmptyList = ({ title }: { title: string }) => {
  return (
    <Text size="1" color="gray">
      <i>No any {title}(s) found!</i>
    </Text>
  );
};

export default EmptyList;
