import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainTemplate} from "./pages/Main/MainTemplate";
import {OutputTemplate} from "./pages/Output/OutputTemplate";
import { createTheme, ThemeProvider } from '@mui/material';

const Router = () => {
  return (
      <BrowserRouter>
          <Routes>
            <Route 
                path={"/"}
                element={<MainTemplate />}
            />
              <Route 
                path={"/output"}
                element={<OutputTemplate />}
              />
          </Routes>
      </BrowserRouter>
  )
}

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
