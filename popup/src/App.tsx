import "./App.css";
import "@radix-ui/themes/styles.css";
import Navigator from "./components/Navigator";
import Layout from "./components/Layout";
import { screens } from "./constants/constants";
import ConfirmationPopup from "./components/ConfirmationPopup";

const App = () => {
  return (
    <Layout>
      <Navigator screens={screens} />
      <ConfirmationPopup />
    </Layout>
  );
};

export default App;
