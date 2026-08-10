import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store/store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <header></header>
        <main></main>
        <footer></footer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
