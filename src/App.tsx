import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store/store";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { ToastProvider } from "./components/common/ToastProvider";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
