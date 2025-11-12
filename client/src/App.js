import AuthProvider from "./context/AuthContext";
import Routes from "./context/main";

function App() {
  return (
    <AuthProvider>
        <Routes />
    </AuthProvider>
  );
}

export default App;
