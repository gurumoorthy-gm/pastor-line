import MainScreen from "./components/MainScreen";
import ContactsModal from "./components/ContactsModal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/modal/:from" element={<ContactsModal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
