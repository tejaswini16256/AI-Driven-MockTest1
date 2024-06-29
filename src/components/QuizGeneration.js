import React, { useState, useContext } from "react"
import axios from "axios"
import DataContext from '../context/dataContext';
import { FaSpinner } from "react-icons/fa"
import "./styles.css"

/// Do some better naming for the components XD...
const GptSearch = () => {
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchedQue, setFetchedQue] = useState("")
  const {setQuizs, startQuiz} = useContext(DataContext);
  async function generate() {
    setLoading(true)
    setFetchedQue([])
    const query = `Generate an MCQ test based on the following description: ${inputValue}.
    Provide the test in the following format:
    [{\"id\":\"01\",\"question\":\"Questiontextgoeshere?\",\"options\":[\"OptionA\",\"OptionB\",\"OptionC\",\"OptionD\"],\"answer\":\"Complete correct option\",\"topicName\":\"Topicname\"},{\"id\":\"01\",\"question\":\"Questiontextgoeshere?\",\"options\":[\"OptionA\",\"OptionB\",\"OptionC\",\"OptionD\"],\"answer\":\"Complete correct option\",\"topicName\":\"Topicname\"}]`
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDAboukzRlEuqeUWvGEPJAFuXTQg_WtsMk",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: query,
                },
              ],
            },
          ],
        },
      })
      setFetchedQue(response.data.candidates[0].content.parts[0].text)
      let questionObj = JSON.parse(response.data.candidates[0].content.parts[0].text)
      setQuizs(questionObj)
      console.log(questionObj)
      startQuiz()
    } catch (error) {
      console.error("Error generating MCQ test: ", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    generate()
    setInputValue("")
  }

  return (
    <div className="gpt-search-container">
      <input
        type="text"
        className="gpt-search-input"
        placeholder="Enter description..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="gpt-search-button" onClick={handleSubmit}>
        Generate Quiz
      </button>
      {loading && <FaSpinner className="loading-icon" />}
      {fetchedQue.length !== 0 && (
        <div>
        </div>
      )}
    </div>
  )
}

export default GptSearch
