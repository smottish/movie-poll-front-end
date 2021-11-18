import { useState, useLayoutEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RootLayout, HeaderLayout, SidebarLayout, MainLayout } from "./ui-kit";
import Header from "./Header";
import Home from "./Home";
import MoviePoll from "./MoviePoll";
import MoviePollDetails from "./MoviePollDetails";
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
    <Router>
      <RootLayout data-testid="app-container">
        <HeaderLayout>
          <Header
            showMenuButton={!isLargeScreen}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </HeaderLayout>
        <SidebarLayout show={isSidebarOpen}></SidebarLayout>
        <MainLayout show={isLargeScreen || !isSidebarOpen}>
          <Switch>
            <Route path="/polls/create" exact={true}>
              <MoviePoll create={true} />
            </Route>
            <Route path="/polls/:id">
              <MoviePollDetails />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </MainLayout>
      </RootLayout>
    </Router>
  );
}

export default App;
