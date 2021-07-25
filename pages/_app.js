import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-supabase";
import supabase from "../supabase";

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={supabase}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
