import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Logout from './Logout'
import { Link } from 'react-router'
import FollowUser from './FollowUser'
import UpdateTweet from "./UpdateTweet"

interface Tweet {
  id: number
  content: string
  currentDate?: string
  username: string
}

function Profil() {
  const storage = localStorage.getItem("stayConnected") === "true" ? localStorage : sessionStorage
  const [username, setUsername] = useState("")
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [profilePicture, setProfilePicture] = useState("")
  const [editingTweetId, setEditingTweetId] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState("")

  const user = storage.getItem("username")

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const usersResponse = await axios.get(`http://localhost:3000/users?username=${user}`)
        if (usersResponse.data.length > 0) {
          setUsername(usersResponse.data[0].username)
          setProfilePicture(usersResponse.data[0].profilePicture || "https://via.placeholder.com/100")
        }

        const tweetsResponse = await axios.get(`http://localhost:3000/tweets?username=${user}`)
        const sortedTweets = tweetsResponse.data.sort(
          (a: any, b: any) => new Date(b.currentDate).getTime() - new Date(a.currentDate).getTime()
        )
        setTweets(sortedTweets)
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error)
      }
    }

    fetchUserInfo()
  }, [user])

  const handleDeleteTweet = (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce bird ?")) return

    fetch(`http://localhost:3000/tweets/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTweets((prev) => prev.filter((t) => t.id !== id))
      })
      .catch((err) => console.error("Erreur suppression tweet:", err))
  }

  const startEditing = (tweet: Tweet) => {
    setEditingTweetId(tweet.id)
    setEditedContent(tweet.content)
  }

  const cancelEditing = () => {
    setEditingTweetId(null)
    setEditedContent("")
  }

  const saveEdit = async (tweetId: number) => {
    if (editedContent.trim() === "") return

    try {
      await UpdateTweet(tweetId, editedContent)
      
      setTweets(prev => 
        prev.map(tweet => 
          tweet.id === tweetId 
            ? { ...tweet, content: editedContent } 
            : tweet
        )
      )
      
      setEditingTweetId(null)
      setEditedContent("")
    } catch (error) {
      console.error("Erreur lors de la modification du bird:", error)
    }
  }
  
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
          <Link to="/BirdPage">
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
          <Logout />
        </div>
      </header>

      <main style={{ 
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        gap: '2rem'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          width: '100%'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            width: '100%'
          }}>
            <div style={{
              height: '150px',
              backgroundColor: '#dc2626',
              backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              position: 'relative'
            }}></div>
            
            <div style={{
              padding: '1rem',
              paddingTop: '4rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: '-3rem',
                width: '6rem',
                height: '6rem',
                borderRadius: '50%',
                border: '4px solid white',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <img 
                  src={profilePicture} 
                  alt={username} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <h2 style={{ 
                color: '#111827', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                margin: '0.5rem 0'
              }}>
                {username}
              </h2>
              <p style={{ color: '#dc2626', fontWeight: 'bold', margin: 0 }}>@{username}</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            padding: '1.5rem',
            width: '100%'
          }}>
            <h2 style={{ 
              color: '#dc2626', 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginTop: 0,
              marginBottom: '1rem'
            }}>
              Mes birds
            </h2>
            
            {tweets.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tweets.map((tweet) => (
                  <div key={tweet.id} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    borderLeft: '4px solid #dc2626',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}>
                      <img 
                        src={profilePicture} 
                        alt={username} 
                        style={{ 
                          width: '2.5rem', 
                          height: '2.5rem', 
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#111827' }}>{username}</span>
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {tweet.currentDate ? new Date(tweet.currentDate).toLocaleString() : "Date inconnue"}
                          </span>
                        </div>
                        
                        {editingTweetId === tweet.id ? (
                          <div style={{ margin: '0.5rem 0' }}>
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #d1d5db',
                                marginBottom: '0.5rem',
                                fontFamily: 'inherit',
                                fontSize: '1rem',
                                minHeight: '5rem',
                                resize: 'vertical'
                              }}
                            />
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'flex-end', 
                              gap: '0.5rem'
                            }}>
                              <button 
                                onClick={() => saveEdit(tweet.id)}
                                style={{
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.4rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                Enregistrer
                              </button>
                              <button 
                                onClick={cancelEditing}
                                style={{
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  border: '1px solid #d1d5db',
                                  padding: '0.4rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p style={{ 
                            margin: '0.5rem 0',
                            color: '#1f2937',
                            fontSize: '1rem',
                            lineHeight: 1.5
                          }}>
                            {tweet.content}
                          </p>
                        )}
                        
                        {editingTweetId !== tweet.id && (
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            gap: '0.5rem',
                            marginTop: '0.5rem'
                          }}>
                            <button 
                              onClick={() => startEditing(tweet)} 
                              style={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteTweet(tweet.id)} 
                              style={{
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
                Vous n'avez pas encore publié de bird.
              </p>
            )}
          </div>
        </div>
        
        <div style={{ width: '100%' }}>
          <FollowUser />
        </div>
      </main>
    </div>
  )
}

export default Profil