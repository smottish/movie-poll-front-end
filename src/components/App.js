import { useState, useLayoutEffect } from "react";
import {
  RootLayout,
  HeaderLayout,
  SidebarLayout,
  MainLayout,
  Text,
} from "./ui-kit";
import Header from "./Header";
import useMedia from "../hooks/useMedia";
import { defaultTheme } from "./ui-kit";

function App() {
  const isLargeScreen = useMedia(`(min-width: ${defaultTheme.screens.sm})`);
  const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen);

  useLayoutEffect(() => {
    // Anytime isSmallScreen changes, update isSidebarOpen
    setIsSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  return (
    <RootLayout data-testid="app-container">
      <HeaderLayout>
        <Header
          showMenuButton={!isLargeScreen}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </HeaderLayout>
      <SidebarLayout show={isSidebarOpen}></SidebarLayout>
      <MainLayout show={isLargeScreen || !isSidebarOpen}>
        <Text size="2xl">Sorry, you don't have any open polls!</Text>
      </MainLayout>
    </RootLayout>
  );
}

export default App;
