import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { checkUrl } from "../utils/utils";

interface Chat {
  chatId: string;
  chatName: string;
}

interface Folder {
  folderID: number;
  folderName: string;
  chats: Chat[];
}

const CustomLabel = ({
  text,
  onMenuClick,
}: {
  text: string;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Typography sx={{ color: "#5D5D5D" }}>{text}</Typography>
    <IconButton onClick={onMenuClick} size="small">
      <MoreVertIcon fontSize="small" />
    </IconButton>
  </div>
);

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = () => {
    const folderExists = folders.some(
      (folder) => folder.folderName.toUpperCase() === folderName.toUpperCase()
    );
    if (folderExists) return;

    const newFolder: Folder = {
      folderID: Math.floor(Math.random() * 10000),
      folderName: folderName,
      chats: [],
    };
    setFolderName("");
    setAnchorEl(null);
    setFolders([newFolder, ...folders]);
  };

  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    folderID: number
  ) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setFolderId(folderID);
  };

  const handleChatSave = async () => {
    if (folderId === 0 || isSaving) return;
    setIsSaving(true);

    try {
      let [tab] = await chrome.tabs.query({ active: true });

      // await chrome.storage.local.get("37fad17a8372224e");

      await chrome.scripting.executeScript<number[], void>({
        target: { tabId: tab.id! },
        args: [folderId],
        func: (folderId) => {
          const containerDiv = document.querySelector(
            ".group.relative.rounded-lg.active\\:opacity-90.bg-token-sidebar-surface-secondary"
          );

          if (containerDiv) {
            // Find the <a> element within the container
            const linkElement = containerDiv.querySelector("a");

            if (linkElement) {
              // Extract the href
              const fullHref = linkElement.getAttribute("href");

              // Extract the name
              const nameElement = linkElement.querySelector('div[dir="auto"]');
              const currentChatName = nameElement
                ? nameElement.firstChild?.textContent?.trim()
                : null;

              console.log("fullHref:", fullHref);
              console.log("Name:", currentChatName);

              chrome.runtime.sendMessage({
                action: "saveChatToFolder",
                folderId: folderId,
                chatData: {
                  chatId: fullHref,
                  chatName: currentChatName,
                },
              });
            } else {
              console.log("No <a> element found within the container.");
            }
          } else {
            console.log("Container div not found.");
          }
        },
      });
    } finally {
      setIsSaving(false);
      setFolderId(0);
      setAnchorEl(null);
    }
  };

  const handleItemClick = async (chatId: string): Promise<void> => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [chatId],
      func: (chatId) => {
        window.location.href = `https://chatgpt.com${chatId}`;
      },
    });
  };

  const handleDeleteFolder = () => {
    setFolders((prevFolders) => {
      const updatedFoldersList = prevFolders.filter(
        (folder) => folder.folderID !== folderId
      );
      localStorage.setItem("folders", JSON.stringify(updatedFoldersList));
      return updatedFoldersList;
    });
    setAnchorEl(null);
    setFolderId(0);
  };

  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.action === "saveChatToFolder") {
        let updateFolders;
        setFolders((prevFolders) =>
          prevFolders.map((folder) => {
            if (folder.folderID === message.folderId) {
              // Check if the chat already exists in the folder
              const chatExists = folder.chats.some(
                (chat) => chat.chatId === message.chatData.chatId
              );
              if (!chatExists) {
                updateFolders = {
                  ...folder,
                  chats: [...folder.chats, message.chatData],
                };

                return updateFolders;
              }
            }
            return folder;
          })
        );
        setFolders((prev) => {
          localStorage.setItem("folders", JSON.stringify(prev));
          return prev;
        });
      }
    };

    !isError &&
      !isLoading &&
      chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [isLoading, isError]);

  useEffect(() => {
    const localStorageFolders = localStorage.getItem("folders");

    if (localStorageFolders) {
      setFolders(JSON.parse(localStorageFolders));
    }
  }, []);

  const emptyMessage = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 10,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Arial",
          }}
          variant="caption"
        >
          No folders found.
        </Typography>
      </Box>
    );
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async (): Promise<void> => {
    try {
      let [tab] = await chrome.tabs.query({ active: true });
      console.log(tab);
      if (!checkUrl(tab.url || "")) {
        setIsError(true);
        return;
      }
    } catch (error) {
      Error("No active tab found or invalid URL");
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "85%",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Arial",
            textAlign: "center",
          }}
          variant="caption"
        >
          Please open a chat in ChatGPT to start organizing your chats.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {folders.length === 0 && emptyMessage()}
      {folders.map((folder) => (
        <SimpleTreeView
          sx={{
            my: 0.8,
            ".css-p13dy5.Mui-selected": {
              backgroundColor: "#ffffff",
            },
            ".css-p13dy5.Mui-selected:hover": {
              backgroundColor: "#ECECEC",
            },
          }}
        >
          <TreeItem
            itemId={folder.folderID.toString()}
            label={
              <CustomLabel
                text={folder.folderName}
                onMenuClick={(e) => handleMenuClick(e, folder.folderID)}
              />
            }
          >
            {folder.chats.map((chat) => (
              <TreeItem
                itemId={chat.chatId.toString()}
                label={chat.chatName}
                onClick={() => handleItemClick(chat.chatId)}
                sx={{
                  my: 0.5,
                  color: "#5D5D5D",
                }}
              />
            ))}
          </TreeItem>
        </SimpleTreeView>
      ))}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          setFolderId(0);
        }}
      >
        <MenuItem onClick={handleDeleteFolder}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Delete</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleChatSave}>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Save Current Chat</Typography>
        </MenuItem>
      </Menu>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 2,
          justifyContent: "space-between",
          position: "absolute",
          width: "95%",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Folder Name"
          value={folderName}
          onChange={handleInputChange}
          sx={{
            bgcolor: "#ECECEC",
            color: "#7D7D7D",
          }}
        />
        <IconButton
          onClick={handleCreateFolder}
          sx={{
            bgcolor: "#ECECEC",
            color: "#7D7D7D",
            "&:hover": {
              bgcolor: "#D6D6D6",
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
