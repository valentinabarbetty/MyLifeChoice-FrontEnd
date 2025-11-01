import { useState } from "react";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Landing from "./pages/Landing/Landing";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Landing />
      )}
    </>
  );
}

export default App;
