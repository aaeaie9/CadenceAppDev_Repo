import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transcriptions, setTranscriptions] = useState([]); // Transcriptions state
  const [activeTranscription, setActiveTranscription] = useState(null); // Active transcription state

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Method to load transcriptions into state
  const loadTranscriptions = (data) => {
    setTranscriptions(data);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        transcriptions, // Provide transcriptions
        loadTranscriptions, // Provide method to load transcriptions
        activeTranscription, // Provide active transcription
        setActiveTranscription, // Provide method to set active transcription
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
