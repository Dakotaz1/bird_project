import React, { Fragment } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './Login'
import BirdPage from './BirdPage'
import SignIn from './SignIn'
import Profil from './Profil'
import UserProfile from './UserProfile'


function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white' 
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/BirdPage" element={<BirdPage />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Profil" element={<Profil />}></Route>
          <Route path="/profil/:username" element={<UserProfile/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;