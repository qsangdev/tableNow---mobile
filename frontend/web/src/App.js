import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import Content from "./components/PageContent";
import SideMenu from "./components/SideMenu";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <Content />
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
