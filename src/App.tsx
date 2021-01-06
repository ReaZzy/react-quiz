import React, {useCallback, useEffect, useState} from 'react';
import {Quiz} from "./Components/Quiz/Quiz";
import axios from "axios";
import {Field, Form, Formik} from "formik";

/*type questionsType = Array<{
    category:string
    type:string
    difficulty:string
    question:string
    correct_answer:string
    incorrect_answers: string[]
}>*/

const App = () => {
    let [questions, setQuestions] = useState([])
    let [currentIndex, setCurrentIndex]= useState(0)
    let [score, setScore] = useState(0)
    let [categories, setCategories] = useState([])
    let [showNextButton, setShowNextButton] = useState(false)
    let [showAnswers, setShowAnswers] = useState(false)
    let [gameStarted, setGameStarted] = useState(false)
    let [anyQuiz, setAnyQuiz] = useState(true)

    const onSubmit = (values:any) => {
        const queryString = require('query-string');
        let query:any = {}
        if (values.number) query.amount =values.number
        if (values.difficult) query.difficulty =values.difficult.toLowerCase()
        if (values.category) query.category =values.category
        axios.get(`https://opentdb.com/api.php?${queryString.stringify(query)}&type=multiple`).then((res:any) => {
            const questions = res.data.results.map((e:any) =>
                ({
                    ...e,
                    question: e.question,
                    answers: [
                        e.correct_answer, ...e.incorrect_answers
                    ].sort(()=>Math.random() - 0.5)
                }))
            setQuestions(questions)
            if( res.data.response_code > 0) setAnyQuiz(false)
            else setAnyQuiz(true)
        })
        setQuestions([])
        setScore(0)
        setCurrentIndex(0)
        setGameStarted(true)
    }
    const submitAnswer =(answer:string) => {
        if (!showAnswers) {
            //@ts-ignore
            if (answer === questions[currentIndex].correct_answer) {
                setScore(prevState => prevState+1)
            }
        }
        setShowNextButton(true)
        setShowAnswers(true)
    }
    const handleNext =  useCallback(() =>{
        setCurrentIndex(prev=>prev+1)
        setShowNextButton(false)
        setShowAnswers(false)
    }, [])

    useEffect(()=>{
        axios.get(`https://opentdb.com/api_category.php`).then(res=>{
            //@ts-ignore
            setCategories(res.data.trivia_categories)
        })
    }, [])


  return (
    <div className="App">
        {gameStarted
            ? anyQuiz
                ? questions.length > 0
                    ? currentIndex >= questions.length
                        ? <h1 style={{display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                            Quiz ended your score is {score} !
                            <button className={"btn btn-outline-success"} onClick={()=>{setGameStarted(false)}}>Play again</button>
                          </h1>
                        : <div>
                            <h3 style={{display:"flex", justifyContent:"center"}}>Current score is {score}</h3>
                            <div style={{display:"flex", justifyContent:"center"}}>{currentIndex+1} / {questions.length}</div>
                            <Quiz questions={questions[currentIndex]} submitAnswer={submitAnswer} showNextButton={showNextButton} handleNext={handleNext} showAnswers={showAnswers}/>
                          </div>
                    :<div>Preloader</div>
                : <div>
                    <h1 style={{display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                        No such quiz finded
                        <button className={"btn btn-outline-success"} onClick={()=>{setGameStarted(false)}}>Find another</button>
                    </h1>
                </div>
            :<div>
                <h1 style={{textAlign:"center"}}>Quiz game</h1>
                <Formik
                initialValues={{number:10}}
                onSubmit={onSubmit}
            >
                <Form>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <Field  className="form-control" style={{width:"10%", textAlign:"center"}} type={"number"} max={50} min={5} name={"number"}/>
                        <Field style={{width:"35%"}} as="select" className="form-control" id="exampleFormControlSelect1" name={"category"}>
                            <option value={""}>Any category</option>
                            {categories.length > 0 && categories.map((e:any, i:number) => <option key={i} value={e.id}>{e.name}</option>)}
                        </Field>
                        <Field style={{width:"35%"}} as="select" className="form-control" id="exampleFormControlSelect1" name={"difficult"}>
                            <option>Any difficulty</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </Field>
                    </div>
                    <button style={{width:"80%",margin:"0 auto", display:"flex", justifyContent:"center", marginTop:"5px"}} type={"submit"} className={"btn btn-success"}>Play</button>
                </Form>
            </Formik></div>
        }
    </div>
  );
}

export default App;
