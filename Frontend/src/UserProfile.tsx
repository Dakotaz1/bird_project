import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { FollowSystemActu } from './FollowUser'

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

interface User {
  username: string
  profilePicture: string
  email?: string
  follow?: string[]
  id?: number
}

interface Tweet {
  id: number
  content: string
  username: string
  currentDate: string
  likes?: string[]
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string>("")
  const [tweetsCount, setTweetsCount] = useState<number>(0)
  const [followersCount, setFollowersCount] = useState<number>(0)

  useEffect(() => {
    const currentUser = localStorage.getItem('username') || sessionStorage.getItem('username')
    if (currentUser) {
      setCurrentUserName(currentUser)
    }

    const fetchUserData = async () => {
      setLoading(true)
      try {
        const userResponse = await axios.get(`http://localhost:3000/users?username=${username}`)
        if (userResponse.data.length === 0) {
          setError("Utilisateur introuvable")
          setLoading(false)
          return
        }
        const userData = userResponse.data[0]
        setUser(userData)
        
        const tweetsResponse = await axios.get(`http://localhost:3000/tweets?username=${username}`)
        const sortedTweets = tweetsResponse.data.sort(
          (a: Tweet, b: Tweet) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
        )
        setTweets(sortedTweets)
        setTweetsCount(sortedTweets.length)
        
        const allUsersResponse = await axios.get('http://localhost:3000/users')
        const followers = allUsersResponse.data.filter(
          (u: User) => u.follow && u.follow.includes(userData.email)
        )
        setFollowersCount(followers.length)
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", error)
        setError("Une erreur s'est produite lors du chargement du profil")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#6b7280'
      }}>
        <svg style={{ 
          animation: 'spin 1s linear infinite',
          width: '3rem',
          height: '3rem',
          marginRight: '1rem'
        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span style={{ fontSize: '1.25rem' }}>Chargement du profil...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#111827',
        padding: '2rem'
      }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '1rem', color: '#dc2626' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"></circle>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
          <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
        </svg>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {error || "Utilisateur introuvable"}
        </h2>
        <p style={{ marginBottom: '2rem', color: '#6b7280', textAlign: 'center' }}>
          Nous n'avons pas pu trouver le profil que vous recherchez.
        </p>
        <Link to="/BirdPage" style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s'
        }}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      minHeight: '100vh',
      margin: 0,
      padding: 0
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
        <Link to="/BirdPage" style={{ textDecoration: 'none' }}>
          <h1 style={{
            color: '#dc2626',
            margin: 0,
            fontSize: '1.75rem',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            Bird
          </h1>
        </Link>
        <Link to="/BirdPage" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>🏠</span>
            Accueil
          </button>
        </Link>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid white',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <img 
                src={user.profilePicture} 
                alt={user.username} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: 'bold',
                color: '#111827',
                margin: '0 0 0.25rem 0'
              }}>
                {user.username}
              </h2>
              <p style={{ 
                color: '#dc2626',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                margin: '0 0 1rem 0'
              }}>
                @{user.username}
              </p>
              
              <div style={{
                display: 'flex',
                gap: '1.5rem',
              }}>
                <div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{tweetsCount}</span>
                  <span style={{ marginLeft: '0.25rem', color: '#6b7280' }}>Birds</span>
                </div>
                <div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{followersCount}</span>
                  <span style={{ marginLeft: '0.25rem', color: '#6b7280' }}>Followers</span>
                </div>
              </div>
            </div>
          </div>
          
          {username !== currentUserName && (
            <div>
              <FollowSystemActu usernameToFollow={user.username} />
            </div>
          )}
        </div>
        
        <div style={{ 
          height: '1px', 
          backgroundColor: '#e5e7eb', 
          margin: '1rem 0 2rem' 
        }}></div>
        
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1.5rem',
          }}>
            Birds de {user.username}
          </h3>
          
          {tweets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tweets.map((tweet) => (
                <div key={tweet.id} style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #dc2626'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <img 
                      src={user.profilePicture} 
                      alt={user.username} 
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#111827' }}>{user.username}</span>
                        <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>@{user.username}</span>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: 'auto' }}>
                          {formatDate(tweet.currentDate)}
                        </span>
                      </div>
                      
                      <p style={{ 
                        margin: '0.75rem 0',
                        color: '#1f2937',
                        fontSize: '1rem',
                        lineHeight: 1.5
                      }}>
                        {tweet.content}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '1.5rem',
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          <span>{tweet.likes?.length || 0}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p>Cet utilisateur n'a pas encore publié de bird.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserProfile