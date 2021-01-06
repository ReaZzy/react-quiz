import React from "react";

type PropsType = {
    questions:any
    submitAnswer: (answer:string) => void
    showAnswers: boolean
    showNextButton: boolean
    handleNext: () => void
}

export const Quiz:React.FC<PropsType> = React.memo(({questions, submitAnswer, showNextButton, handleNext, showAnswers}) => {
    return (
        <div>
            <h2 style={{border:"1px solid black", borderRadius:"10px", padding:"5px", marginBottom:"10px"
            }} dangerouslySetInnerHTML={{__html:questions.question}}/>
            <div style={{display:"flex", width:"100%", justifyContent:"space-between", flexWrap:"wrap"}}>
                    <button className={showAnswers?  questions.correct_answer === questions.answers[0] ? "btn btn-success": "btn btn-danger" :"btn btn-light"} onClick={()=>{submitAnswer(questions.answers[0])}}>{questions.answers[0]}</button>
                    <button className={showAnswers?  questions.correct_answer === questions.answers[1] ? "btn btn-success": "btn btn-danger" :"btn btn-light"} onClick={()=>{submitAnswer(questions.answers[1])}}>{questions.answers[1]}</button>
                    <button className={showAnswers?  questions.correct_answer === questions.answers[2] ? "btn btn-success": "btn btn-danger" :"btn btn-light"} onClick={()=>{submitAnswer(questions.answers[2])}}>{questions.answers[2]}</button>
                    <button className={showAnswers?  questions.correct_answer === questions.answers[3] ? "btn btn-success": "btn btn-danger" :"btn btn-light"} onClick={()=>{submitAnswer(questions.answers[3])}}>{questions.answers[3]}</button>
            </div>

            {showNextButton && <button style={{display:"flex", justifyContent:"center", flexWrap:"wrap", marginBottom:"5px", marginTop:"5px", width:"100%"}} className={"btn btn-outline-success"}onClick={()=>{handleNext()}}>Next</button>}
        </div>
    )
})