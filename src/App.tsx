import "./App.css";
import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import Home from "./components/Home";

function App() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar
          sx={{
            bgcolor: "#74AA9C",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "sans-serif",
              color: "#ffff",
            }}
            variant="body1"
            fontWeight="bold"
          >
            ChatGPT Chat Organizer
          </Typography>
          <Typography
            sx={{
              fontFamily: "sans-serif",
              color: "#ffff",
            }}
            variant="body2"
          >
            V1.0.10
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          mt: 0.5,
          height: "89%",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Home />
      </Box>
    </Box>
  );
}

export default App;
