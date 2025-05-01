import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FollowSystemActu } from './FollowUser' 
import LikeButton from './LikeButton'

function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

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

interface ShowTweetProps {
  refreshTweets?: () => void;
}

const ShowTweet: React.FC<ShowTweetProps> = ({ refreshTweets }) => {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const currentUser = localStorage.getItem('username') || sessionStorage.getItem('username') || ''
  
  const fetchTweets = async () => {
    setLoading(true)
    try {
      const tweetRes = await axios.get("http://localhost:3000/tweets")
      const tweetsWithPics = await Promise.all(
        tweetRes.data.map(async (tweet: any) => {
          try {
            const userRes = await axios.get(`http://localhost:3000/users?username=${tweet.username}`)
            const profilePicture = userRes.data[0]?.profilePicture || ""
            return { ...tweet, profilePicture }
          } catch {
            return { ...tweet, profilePicture: "" }
          }
        })
      )
      
      const sorted = tweetsWithPics.sort(
        (a: any, b: any) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
      )
      
      setTweets(sorted)
    } catch (error) {
      console.error("Erreur lors de la récupération des tweets:", error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTweets()
  }, [])
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: '#6b7280'
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
    )
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tweets.map((tweet) => (
        <div key={tweet.id} style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.25rem',
          transition: 'all 0.2s ease',
          borderLeft: tweet.username === currentUser ? '4px solid #dc2626' : 'none'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <Link to={`/profil/${tweet.username}`} style={{ textDecoration: 'none' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                overflow: 'hidden',
                border: tweet.username === currentUser ? '2px solid #dc2626' : '2px solid #e5e7eb',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}>
                <img 
                  src={tweet.profilePicture || "https://via.placeholder.com/100"} 
                  alt={`Avatar de ${tweet.username}`} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </Link>
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start'
              }}>
                <div>
                  <Link to={`/profil/${tweet.username}`} style={{ textDecoration: 'none' }}>
                    <span style={{ 
                      color: '#111827', 
                      fontWeight: 'bold',
                      marginRight: '0.5rem'
                    }}>
                      {tweet.username}
                    </span>
                    <span style={{ 
                      color: '#dc2626', 
                      fontSize: '0.875rem'
                    }}>
                      @{tweet.username}
                    </span>
                  </Link>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    marginLeft: '0.75rem'
                  }}>
                    {formatDate(tweet.currentDate)}
                  </span>
                </div>
                
                {tweet.username !== currentUser && (
                  <FollowSystemActu usernameToFollow={tweet.username} />
                )}
              </div>
              
              <p style={{ 
                marginTop: '0.75rem',
                marginBottom: '1rem',
                color: '#1f2937',
                fontSize: '1rem',
                lineHeight: 1.5
              }}>
                {tweet.content}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '0.5rem'
              }}>
                <LikeButton id={tweet.id} username={currentUser}/>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShowTweet