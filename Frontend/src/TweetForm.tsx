import React, { useState } from 'react'
import axios from 'axios'

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

interface TweetFormProps {
  onTweetPosted: () => void;
  profilePicture?: string;
}

function TweetForm({ onTweetPosted, profilePicture }: TweetFormProps) {
  const [tweet, setTweet] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleTweetPost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (tweet.trim() === "") {
      setError("Le bird ne peut pas être vide.")
      return
    }
    
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    const email = localStorage.getItem("email") || sessionStorage.getItem("email")
    const username = localStorage.getItem("username") || sessionStorage.getItem("username")
    const currentDate = new Date().toISOString()
    
    if (!accessToken || !email) {
      alert("L'utilisateur n'est pas connecté.")
      return
    }
    
    try {
      setIsSubmitting(true)
      await axios.post("http://localhost:3000/tweets", {
        content: tweet,
        username,
        currentDate,
      })
      setTweet("")
      setError("")
      onTweetPosted()
    } catch (error) {
      console.error("Erreur lors de la publication du bird:", error)
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const charCount = tweet.length
  const maxChars = 280
  const isNearLimit = charCount > maxChars * 0.8 && charCount <= maxChars
  const isOverLimit = charCount > maxChars
  
  return (
    <div>
      <form onSubmit={handleTweetPost}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src={profilePicture || "https://via.placeholder.com/100"} 
              alt="Votre avatar" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          
          <div style={{ width: '100%' }}>
            <textarea 
              value={tweet} 
              onChange={(e) => setTweet(e.target.value)} 
              placeholder="Qu'avez-vous en tête ?" 
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '1rem',
                resize: 'none',
                minHeight: '6rem',
                backgroundColor: 'white',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                transition: 'border-color 0.2s ease',
                borderColor: isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#e5e7eb'
              }}
              rows={3}
            />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.75rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#6b7280'
              }}>
                {isOverLimit ? `Dépassement de ${charCount - maxChars} caractères` : `${charCount}/${maxChars}`}
              </div>
              
              {error && <p style={{ 
                color: '#ef4444', 
                margin: 0,
                fontSize: '0.875rem'
              }}>{error}</p>}
              
              <button 
                type="submit" 
                disabled={isSubmitting || isOverLimit}
                style={{ 
                  backgroundColor: isSubmitting || isOverLimit ? '#f3f4f6' : '#dc2626', 
                  color: isSubmitting || isOverLimit ? '#9ca3af' : 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isSubmitting || isOverLimit ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg style={{ 
                      animation: 'spin 1s linear infinite',
                      width: '1rem',
                      height: '1rem'
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi...
                  </>
                ) : "Publier"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TweetForm