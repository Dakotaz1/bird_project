import React, { useState, useEffect } from 'react'
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

interface FollowButtonProps {
  userToFollow: {
    email: string;
    username: string;
  };
  currentUser: any;
  onFollowToggle: (email: string) => void;
  isProcessing?: boolean;
  mode?: 'compact' | 'full'; 
}


const FollowButton: React.FC<FollowButtonProps> = ({ 
  userToFollow, 
  currentUser, 
  onFollowToggle,
  isProcessing = false,
  mode = 'compact'
}) => {
  const isFollowing = currentUser?.follow?.includes(userToFollow.email) || false;

  if (mode === 'compact') {
    return (
      <button 
        onClick={() => onFollowToggle(userToFollow.email)} 
        disabled={isProcessing}
        style={{
          backgroundColor: isFollowing ? 'transparent' : '#3b82f6',
          color: isFollowing ? '#6b7280' : 'white',
          border: isFollowing ? '1px solid #d1d5db' : 'none',
          padding: '0.4rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          outline: 'none'
        }}
      >
        {isProcessing ? (
          <svg style={{ 
            animation: 'spin 1s linear infinite',
            width: '1rem',
            height: '1rem'
          }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isFollowing ? (
          <>
            <svg style={{ width: '1rem', height: '1rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 9v6M14 9v6M18 6H6v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6zM5 6l1-3h12l1 3"/>
            </svg>
            <span>Ne plus suivre</span>
          </>
        ) : (
          <>
            <svg style={{ width: '1rem', height: '1rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span>Suivre</span>
          </>
        )}
      </button>
    );
  } else {
    return (
      <button 
        onClick={() => onFollowToggle(userToFollow.email)} 
        disabled={isProcessing}
        style={{ 
          backgroundColor: isFollowing ? '#dc2626' : '#3b82f6',
          color: 'white',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: 'none',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {isProcessing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg style={{ 
              animation: 'spin 1s linear infinite',
              width: '1rem',
              height: '1rem'
            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Patientez...</span>
          </div>
        ) : (
          isFollowing ? "Ne plus suivre" : "Suivre"
        )}
      </button>
    );
  }
};

export const FollowButton1: React.FC<{ usernameToFollow: string }> = ({ usernameToFollow }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [followedUser, setFollowedUser] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    const currentUsername = localStorage.getItem('username') || sessionStorage.getItem('username')
    if (!currentUsername || currentUsername === usernameToFollow) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [currentUserRes, followedUserRes] = await Promise.all([
          axios.get(`http://localhost:3000/users?username=${currentUsername}`),
          axios.get(`http://localhost:3000/users?username=${usernameToFollow}`)
        ])

        setCurrentUser(currentUserRes.data[0] || null)
        setFollowedUser(followedUserRes.data[0] || null)
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [usernameToFollow])

  const handleFollowToggle = async (userEmail: string) => {
    if (!currentUser || !followedUser || isProcessing) return

    setIsProcessing(true)
    
    const follows = Array.isArray(currentUser.follow) ? currentUser.follow : []
    const isFollowing = follows.includes(userEmail)
    const updatedFollows = isFollowing
      ? follows.filter(email => email !== userEmail)
      : [...follows, userEmail]

    try {
      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, { follow: updatedFollows })
      setCurrentUser({ ...currentUser, follow: updatedFollows })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du suivi :", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        fontSize: '0.875rem',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <svg style={{ 
          animation: 'spin 1s linear infinite',
          width: '1rem',
          height: '1rem'
        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (!currentUser || !followedUser || currentUser.username === usernameToFollow) {
    return null
  }

  return (
    <FollowButton
      userToFollow={followedUser}
      currentUser={currentUser}
      onFollowToggle={handleFollowToggle}
      isProcessing={isProcessing}
      mode="compact"
    />
  )
}

const FollowSystem: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [processingUser, setProcessingUser] = useState<string | null>(null)

  useEffect(() => {
    const currentUserEmail = localStorage.getItem('email') || sessionStorage.getItem('email')

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users')
        const allUsers = response.data
        const loggedInUser = allUsers.find((user: any) => user.email === currentUserEmail)
        setCurrentUser(loggedInUser)
        const filteredUsers = allUsers.filter((user: any) => user.email !== currentUserEmail)
        setUsers(filteredUsers)
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs : ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleFollowToggle = async (userEmail: string) => {
    if (!currentUser || processingUser) return
    
    setProcessingUser(userEmail)
    
    const follows = Array.isArray(currentUser.follow) ? currentUser.follow : []
    const isFollowing = follows.includes(userEmail)
    const updatedFollows = isFollowing
      ? follows.filter(email => email !== userEmail)
      : [...follows, userEmail]

    try {
      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, { follow: updatedFollows })
      setCurrentUser({ ...currentUser, follow: updatedFollows })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du suivi :", error)
    } finally {
      setProcessingUser(null)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <svg style={{ 
          animation: 'spin 1s linear infinite',
          marginRight: '0.5rem',
          width: '1.5rem',
          height: '1.5rem',
          color: '#6b7280'
        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span style={{ color: '#6b7280' }}>Chargement des utilisateurs...</span>
      </div>
    )
  }

  if (!currentUser) {
    return <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>Utilisateur non trouvé.</div>
  }

  if (users.length === 0) {
    return <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>Aucun utilisateur à afficher.</div>
  }

  const followedUsers = users.filter(user => 
    currentUser.follow && currentUser.follow.includes(user.email)
  )
  
  const suggestedUsers = users.filter(user => 
    !currentUser.follow || !currentUser.follow.includes(user.email)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {followedUsers.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1rem'
        }}>
          <h3 style={{
            color: '#dc2626',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Mes amis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {followedUsers.map((user) => (
              <div key={user.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem'
              }}>
                <span style={{ fontWeight: 500, color: '#111827' }}>{user.username}</span>
                <FollowButton
                  userToFollow={user}
                  currentUser={currentUser}
                  onFollowToggle={handleFollowToggle}
                  isProcessing={processingUser === user.email}
                  mode="full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestedUsers.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1rem'
        }}>
          <h3 style={{
            color: '#dc2626',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Suggestions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestedUsers.map((user) => (
              <div key={user.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem'
              }}>
                <span style={{ fontWeight: 500, color: '#111827' }}>{user.username}</span>
                <FollowButton
                  userToFollow={user}
                  currentUser={currentUser}
                  onFollowToggle={handleFollowToggle}
                  isProcessing={processingUser === user.email}
                  mode="full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FollowSystem
export { FollowButton1 as FollowSystemActu } 