import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./redux/store/store";
import Login from "./pages/auth/Login";
import RegistrazioneOspite from "./pages/auth/RegistrazioneOspite";
import AttivaAccount from "./pages/auth/AttivaAccount";
import PasswordDimenticata from "./pages/auth/PasswordDimenticata";
import ResetPassword from "./pages/auth/ResetPassword";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <header></header>
        <main>
          <Routes>
            <Route path="/" element={<p>Home — arriva nel Task 5/7</p>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrati" element={<RegistrazioneOspite />} />
            <Route path="/attiva-account" element={<AttivaAccount />} />
            <Route
              path="/password-dimenticata"
              element={<PasswordDimenticata />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
        <footer></footer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
