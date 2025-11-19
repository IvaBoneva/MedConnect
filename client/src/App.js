import AuthProvider from "./context/AuthContext";
import Routes from "./context/Routes";

function App() {
  return (
    <AuthProvider>
        <Routes />
    </AuthProvider>
  );
}

export default App;
