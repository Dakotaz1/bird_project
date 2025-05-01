import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Heart, HeartCrack } from 'lucide-react'

interface LikeButtonProps {
  id: number
  username: string
}

const LikeButton: React.FC<LikeButtonProps> = ({ id, username }) => {
  const [likedBy, setLikedBy] = useState<string[]>([])
  const [likeCount, setLikeCount] = useState<number>(0)

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tweets/${id}`)
        setLikedBy(response.data.likedBy || [])
        setLikeCount(response.data.like || 0)
      } catch (error) {
        console.error('Erreur lors du chargement du tweet :', error)
      }
    }

    fetchTweet()
  }, [id])

  const isLiked = likedBy.includes(username)

  const handleLikeToggle = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/tweets/${id}`)
      const currentLikedBy: string[] = res.data.likedBy || []
      const isCurrentlyLiked = currentLikedBy.includes(username)

      const updatedLikedBy = isCurrentlyLiked
        ? currentLikedBy.filter(user => user !== username)
        : [...currentLikedBy, username]

      const updatedLikeCount = isCurrentlyLiked
        ? (res.data.like || 1) - 1
        : (res.data.like || 0) + 1

      await axios.patch(`http://localhost:3000/tweets/${id}`, {
        likedBy: updatedLikedBy,
        like: updatedLikeCount,
      })

      setLikedBy(updatedLikedBy)
      setLikeCount(updatedLikeCount)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du like :', error)
    }
  }

  return (
    <button
  onClick={handleLikeToggle}
  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border-2 
    ${isLiked 
      ? 'bg-red-900 border-red-600 text-white hover:bg-red-800' 
      : 'bg-zinc-900 border-zinc-700 text-red-400 hover:bg-zinc-800'}
  `}
>
  {isLiked ? (
    <HeartCrack className="w-5 h-5 text-red-500" />
  ) : (
    <Heart className="w-5 h-5 text-red-400" />
  )}
  <span className="text-sm font-bold">{likeCount}</span>
</button>

  )
}

export default LikeButton
