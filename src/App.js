import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [answer, setAnswer] = useState(""); //stores answer
  const [question, setQuestion] = useState(""); //stores question
  const [error, setError] = useState(""); //incase api call fails display error message
  const [correct, setCorrect] = useState(false); //if user input and answer matches set true
  const [display, setDisplay] = useState(""); //display result string
  const [loading, setLoading] = useState(true);
  const inputRef = useRef();

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      try {
        setDisplay("");
        const result = await fetch("https://jservice.io/api/random");
        const data = await result.json();

        setAnswer(
          data[0].answer
            .replace(/[-?,./()'"]/g, "")
            .replace(/<i>/g, "")
            .replace("&", "and")
        );
        setQuestion(data[0].question);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchApi, 2000);
    setCorrect(false);

    return () => clearInterval(timer);
  }, [correct]);

  const handleCheck = () => {
    const userInput = inputRef.current.value.replaceAll(/\s+/g, " ").trim();
    if (userInput.toLowerCase().includes(answer.toLocaleLowerCase())) {
      setCorrect(true);
      setDisplay("Yay!! Correct Answer");
      inputRef.current.value = "";
    } else {
      setDisplay("Oh no! Incorrect :(");
      inputRef.current.value = "";
    }
  };

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="container">
      {display && <h3 className="result">{display}</h3>}
      <div className="main-container">
        <h1>Trivia Game</h1>
        {loading ? <p>Loading....</p> : <p>{question}</p>}
        <input id="answer" placeholder="Enter answer..." ref={inputRef} />
        <button onClick={handleCheck}>Check Answer</button>
      </div>
    </div>
  );
};

export default App;
