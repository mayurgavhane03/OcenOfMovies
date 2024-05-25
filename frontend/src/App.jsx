import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MovieForm from "./Components/MovieForm ";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MovieForm />
    </>
  );
}

export default App;
