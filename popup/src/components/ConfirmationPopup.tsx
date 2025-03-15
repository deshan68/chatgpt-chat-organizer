import React from "react";
import { useConfirmation } from "../context/ConfirmationContext";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";

const ConfirmationPopup: React.FC = () => {
  const { confirmationData, hideConfirmation, isVisible } = useConfirmation();

  if (!isVisible || !confirmationData) return null;

  return (
    <Flex
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AlertDialog.Root open={true}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title size={"2"}>
            {confirmationData.title}
          </AlertDialog.Title>
          <AlertDialog.Description size="1">
            {confirmationData.message}
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button
                variant="soft"
                color="gray"
                onClick={() => {
                  confirmationData.onCancel?.();
                  hideConfirmation();
                }}
                size={"1"}
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={() => {
                  confirmationData.onConfirm?.();
                  hideConfirmation();
                }}
                size={"1"}
              >
                Confirm
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
};

export default ConfirmationPopup;
