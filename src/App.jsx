import { Route, Routes } from "react-router-dom";
// import Template from "./pages/_TemplatePage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import FavouritesPage from "./pages/FavouritesPage";

function App() {
  // Fetch user Location and save to Context

  return (
    <>
      {/* Routing */}
      <Routes>
        {/* <Route path="/" element={<Template />} /> */}
        <Route index element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </>
  );
}

export default App;
