//<<<<<<< HEAD
//import { useState } from "react";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
//import "./App.tsx";

//function App() {
//  const [count, setCount] = useState(0);}
//=======
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
//>>>>>>> cea008626e4b5a6ed7dd1e38090c93ad65848590

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout></Layout>}/>
        <Route path="/search" element={<>Search Page</>}/>
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </Router>
  );
};

export default App;
