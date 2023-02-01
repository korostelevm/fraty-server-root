import { Quiz } from "../../models/user";
import { QuizTask } from "../../models/admin";

const returnAttendedQuestions = async (wallet:string,id:string) => {
    const quiz = await Quiz.findOne({ wallet,taskID:id })
    return quiz
}

const returnQuiz = async (id:string) => {
    const quiz = await QuizTask.findOne({ taskID:id })
    if(!quiz) return { error: "Quiz Not Found" }
    return quiz.quiz
}

const CheckAnswer = async(taskID:string,questionID:number,answer:string) => {
    console.log(taskID,questionID,answer);
    const quiz = await QuizTask.findOne({ taskID });
    if(!quiz) return { error: "Quiz Not Found" };
    const question = quiz?.quiz?.find((item:any) => questionID == item.id);
    if(!question) return { error: "Question Not Found" };
    let answerData = question?.answers?.find((item:any) => item?.isCorrect === true);
    if(answerData?.val == answer) return { success: "Correct Answer" };
    return { wrong: "Wrong Answer" };
}

const UpdateData = async (wallet:string,taskID:string,id:number,isCorrect:boolean) => {
    const quizData:any = await Quiz.findOne({ wallet,taskID:taskID })
    if(quizData && quizData?.attemptedQuestions?.find((item:any) => item?.id === id) ) return { success: "Data Updated"};
    if(quizData) await Quiz.updateOne({ wallet,taskID:taskID }, { attemptedQuestions: [...quizData?.attemptedQuestions, {
        id,
        isCorrect,
      }] }); 
    else await Quiz.create({ wallet,taskID:taskID,attemptedQuestions: [{
        id,
        isCorrect,
        }] });
    return { success: "Data Updated"};
}

const DeleteResponse = async (wallet:string,taskID:string) => {
    const quizData:any = await Quiz.findOne({ wallet,taskID:taskID })
    if(quizData) await Quiz.updateOne({ wallet,taskID:taskID }, { attemptedQuestions: [] });
    return { success: "Data Deleted"};
}

export {
    returnAttendedQuestions,
    returnQuiz,
    UpdateData,
    CheckAnswer,
    DeleteResponse
}