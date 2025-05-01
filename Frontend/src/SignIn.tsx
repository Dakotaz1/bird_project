import axios from 'axios' 
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignIn() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }, []);
    
    const handleSignIn = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        
        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères")
          setIsLoading(false)
          return
        }
        
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas")
          setIsLoading(false)
          return
        }

        try {
          const success = await register(username, email, password)

          if (success) {
              setUsername("")
              setEmail("")
              setPassword("")
              setConfirmPassword("")
              navigate("/BirdPage")
          }
        } catch (error) {
          console.error("Erreur pendant l'inscription:", error)
          setError("Une erreur inattendue s'est produite")
        } finally {
          setIsLoading(false)
        }
    }

    async function register(username, email, password) {
        try {
            const checkUser = await axios.get(`http://localhost:3000/users?email=${email}`)
            if (checkUser.data.length > 0) {
                setError("Cet email est déjà utilisé")
                return false
            }
            
            const checkUsername = await axios.get(`http://localhost:3000/users?username=${username}`)
            if (checkUsername.data.length > 0) {
                setError("Ce nom d'utilisateur est déjà pris")
                return false
            }
            
            const response = await axios.post('http://localhost:3000/users', {
                username,
                email,
                password,
                profilePicture: "https://ui-avatars.com/api/?name=" + username + "&background=dc2626&color=fff",
                follow: []
            })
            
            const accessToken = `user-token-${Date.now()}`
            sessionStorage.setItem("accessToken", accessToken)
            sessionStorage.setItem("email", email)
            sessionStorage.setItem("username", username)
            sessionStorage.setItem("userId", response.data.id)
            
            return true
        } catch (error) {
            console.error(error)

            if (error.response && error.response.status === 400) {
                setError("Cet email ou nom d'utilisateur est déjà utilisé !")
            } else {
                setError("Une erreur est survenue !")
            }

            return false
        }
    }

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          flex: '1',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '400px',
            width: '100%'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Créer un compte
            </h2>
            
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Rejoignez notre communauté pour partager vos birds
            </p>
            
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#b91c1c"/>
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="username" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#4b5563',
                  marginBottom: '0.25rem'
                }}>
                  Nom d'utilisateur
                </label>
                <input 
                  id="username"
                  type="text" 
                  placeholder="Choisissez un nom d'utilisateur" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="email" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#4b5563',
                  marginBottom: '0.25rem'
                }}>
                  Adresse e-mail
                </label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Entrez votre adresse e-mail" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="password" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#4b5563',
                  marginBottom: '0.25rem'
                }}>
                  Mot de passe
                </label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="Créez un mot de passe (min. 6 caractères)" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="confirmPassword" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#4b5563',
                  marginBottom: '0.25rem'
                }}>
                  Confirmer le mot de passe
                </label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="Confirmez votre mot de passe" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {isLoading ? (
                  <>
                    <svg 
                      style={{ animation: 'spin 1s linear infinite', width: '1.25rem', height: '1.25rem' }} 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        style={{ opacity: 0.25 }} 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="none"
                      ></circle>
                      <path 
                        style={{ opacity: 0.75 }} 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Inscription en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>
            
            <div style={{
              marginTop: '2rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              <p>
                Vous avez déjà un compte ? 
                <Link 
                  to="/Login" 
                  style={{
                    color: '#dc2626',
                    fontWeight: '500',
                    textDecoration: 'none',
                    marginLeft: '0.35rem'
                  }}
                >
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div style={{
          flex: '1',
          backgroundColor: '#dc2626',
          backgroundImage: 'linear-gradient(to bottom right, #dc2626, #991b1b)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            top: '-50px',
            right: '-50px'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            bottom: '50px',
            left: '50px'
          }}></div>
          
          <div style={{
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '3rem',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <svg viewBox="0 0 24 24" width="80" height="80" fill="white">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
              </svg>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginTop: '1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                Bird
              </h1>
            </div>
            
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Bienvenue !
            </h2>
            
            <p style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              Prêt à rejoindre notre communauté ? Créez votre compte et commencez à partager vos idées avec le monde entier.
            </p>
          </div>
        </div>
      </div>
    )     
}

export default SignIn