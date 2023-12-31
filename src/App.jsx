
import './App.css'
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import SplashPage from './components/splashPage';
import FetchNotes from './components/fetchNotes';
import AddNote from './components/home.jsx';
import ViewProfile from './components/viewProfile.jsx';
import CreateTasks from './components/createTasks.jsx';
import NavigationBar from './components/navigationBar.jsx';
import { useAuth } from './AuthContext.jsx';
import ProfilePhoto from './components/profilePhoto.jsx';
import { useNavigate } from 'react-router-dom';
import Fallback from './components/fallback.jsx';
import ViewNote from './components/viewNote.jsx';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/dist/sw.js') // Adjust the path accordingly
      .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
          console.error('Service Worker registration failed:', error);
      });
}
function App() {

  const { user, logout, signup, signin } = useAuth();
  const navigate = useNavigate();
  const [onlinestatus, setOnlineStatus] = useState(navigator.onLine);
    useEffect(() => {
        // Event listener to update online status
        const handleOnlineStatus = () => {
            setOnlineStatus(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    if(!onlinestatus){
        return <Fallback />
    }

   useEffect(() => {
     if (user == null)
       navigate("/Note-App/")
   }
     ,

     [user])



  const renderRoutes = () => {
    if (user) {
      return (
        <>

          <Routes>

            <Route path="/Note-App/ViewProfile" element={<ViewProfile />} />
            <Route path="/Note-App/AddNote" element={<AddNote />} />
            <Route path="/Note-App/" element={<FetchNotes />} />
            <Route path="/Note-App/ViewProfile" element={<ViewProfile />} />
            <Route path="/Note-App/CreateTasks" element={<CreateTasks />} />
            <Route path="/Note-App/profilePhoto" element={<ProfilePhoto />} />
            <Route path="/Note-App/fallback" element={<Fallback />} />
            <Route path="/Note-App/ViewNote" element={<ViewNote />} />

          </Routes>



        </>
      )
    } else {
      return (

        <>

          <Routes>
            <Route path="/Note-App/" element={<SplashPage />} />

            <Route path="/Note-App/signin" element={<Signin />} />
            <Route path="/Note-App/signup" element={<Signup />} />
          </Routes>


        </>
      );

    }
  }




  return (
    <div className='-mt-12 '>
      <NavigationBar />
      {renderRoutes()}
    </div>

  );
}


export default App

