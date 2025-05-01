import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TweetForm from './TweetForm'
import ShowTweet from './ShowTweet'
import { Link } from 'react-router-dom'
import Logout from './Logout'

const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = spinKeyframes;
  document.head.appendChild(styleElement);
}

function BirdPage() {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  const fetchTweets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get("http://localhost:3000/tweets")
      const sortedTweets = response.data.sort(
        (a: any, b: any) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
      )
      setTweets(sortedTweets)
    } catch (err) {
      console.error("Erreur de chargement des tweets:", err)
      setError("Une erreur est survenue lors du chargement des tweets.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTweets()
    
    const currentUsername = localStorage.getItem('username') || sessionStorage.getItem('username')
    if (currentUsername) {
      axios.get(`http://localhost:3000/users?username=${currentUsername}`)
        .then(res => {
          if (res.data.length > 0) {
            setUsername(res.data[0].username)
            setProfilePicture(res.data[0].profilePicture || "https://via.placeholder.com/100")
          }
        })
        .catch(err => console.error("Erreur lors de la récupération du profil:", err))
    }
  }, [])

  return (
    <div style={{ 
      backgroundColor: 'white',
      minHeight: '100vh',
      padding: '0',
      margin: '0'
    }}>
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #eaeaea',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{
          color: '#dc2626',
          margin: 0,
          fontSize: '1.75rem',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          Bird
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/Profil" style={{ textDecoration: 'none' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: '#f3f4f6',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              transition: 'all 0.2s ease'
            }}>
              {profilePicture && (
                <img 
                  src={profilePicture} 
                  alt={username} 
                  style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '2px solid #dc2626'
                  }}
                />
              )}
              <span style={{ 
                color: '#374151',
                fontWeight: 600
              }}>
                {username || "Mon Profil"}
              </span>
            </div>
          </Link>
          <Logout />
        </div>
      </header>

      <main style={{ 
        display: 'flex',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '1.5rem',
          width: '100%'
        }}>
          <TweetForm onTweetPosted={fetchTweets} profilePicture={profilePicture} />
        </div>

        <div style={{
          width: '100%'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              color: '#6b7280',
              fontSize: '1rem'
            }}>
              <svg style={{ 
                animation: 'spin 1s linear infinite',
                marginRight: '0.5rem',
                width: '1.5rem',
                height: '1.5rem'
              }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement des birds...
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}>
              {error}
            </div>
          ) : tweets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}>
              Aucun bird à afficher pour le moment.
            </div>
          ) : (
            <ShowTweet refreshTweets={fetchTweets} />
          )}
        </div>
      </main>
    </div>
  )
}

export default BirdPage