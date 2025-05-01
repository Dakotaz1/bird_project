import React from "react"
import { useNavigate } from "react-router-dom"

function Logout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken")
    }
    if (localStorage.getItem("username")) {
      localStorage.removeItem("username")
    }
    if (localStorage.getItem("email")) {
      localStorage.removeItem("email")
    }
    if (localStorage.getItem("stayConnected")) {
      localStorage.removeItem("stayConnected")
    }
    if (sessionStorage.getItem("accessToken")) {
        sessionStorage.removeItem("accessToken")
    }
    if (sessionStorage.getItem("username")) {
      sessionStorage.removeItem("username")
    }
    if (sessionStorage.getItem("email")) {
      sessionStorage.removeItem("email")
    }   
    navigate("/")
  }

  return (
    <div className="mt-6">
      <button onClick={handleLogout} className="w-full max-w-xs p-3 rounded-lg transition duration-300 bg-gradient-to-r from-red-800 to-red-600 text-white font-bold tracking-wider hover:from-red-700 hover:to-red-500 shadow-md shadow-red-900 hover:shadow-lg">
        Déconnexion
      </button>
    </div>
  )
  

}

export default Logout
