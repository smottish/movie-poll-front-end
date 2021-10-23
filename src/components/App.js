import { RootLayout, HeaderLayout, SidebarLayout, MainLayout, Text } from './ui-kit'
import Header from './Header'
function App() {
  return (
    <RootLayout data-testid="app-container">
      <HeaderLayout>
        <Header/>
      </HeaderLayout>
      <SidebarLayout>
      </SidebarLayout>
      <MainLayout>
        <Text size="2xl">Sorry, you don't have any open polls!</Text>
      </MainLayout>
    </RootLayout>
  )
}

export default App;