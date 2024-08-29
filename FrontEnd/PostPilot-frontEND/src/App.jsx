import Hero from "./components/hero";
import { useEffect } from "react";
import { checkUserStatus } from "./components/functions/IsUserLoggedIn";


const fetchUserStatus = async () => {
    const loggedIn = await checkUserStatus();
    console.log(loggedIn); 
};


function App() {
  useEffect(() => {

    fetchUserStatus();

  
  }, []);

  return (
    <>
      <Hero />
    </>
  );
}

export default App;
