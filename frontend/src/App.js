import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainTemplate} from "./pages/Main/MainTemplate";
import {OutputTemplate} from "./pages/Output/OutputTemplate";

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
  return (
    <Router />
  );
}

export default App;
