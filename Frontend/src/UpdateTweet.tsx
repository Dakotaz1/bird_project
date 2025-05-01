import axios from "axios"

async function UpdateTweet(tweetId: number, newContent: string) {
  try {
    const response = await axios.patch(`http://localhost:3000/tweets/${tweetId}`, {
      content: newContent,
    })
    console.log("Tweet modifié avec succès :", response.data)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la modification du tweet :", error)
    throw error
  }
}

export default UpdateTweet