import { Flex, Text } from "@radix-ui/themes";

const InvalidUrlMessage = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      px="4"
      style={{
        width: "100%",
        textAlign: "center",
        height: 600,
      }}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        p="2"
        style={{
          border: "1px solid red",
          backgroundColor: "#FFE5E5",
        }}
      >
        <Text size="2" weight="bold" color="red">
          🚨 Invalid Website Detected
        </Text>
        <Text size="1">
          This extension only works on <strong>chat.deepseek.com</strong> or{" "}
          <strong>chatgpt.com</strong>. Please navigate to the correct website
          to use this extension.
        </Text>
      </Flex>
    </Flex>
  );
};

export default InvalidUrlMessage;
