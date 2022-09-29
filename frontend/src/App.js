import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainTemplate} from "./Main/MainTemplate";

const Router = () => {
  return (
      <BrowserRouter>
          <Routes>
            <Route 
              path={"/"}
              element={<MainTemplate />}
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
