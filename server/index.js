import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
dotenv.config();
const openai = new OpenAI({ apiKey:process.env.APIKEY});

app.post('/api/generatequeston',async(req,res)=>{
    const {topic}=req.body;
    console.log(topic);

    if(topic){
        try {
            const prompt = `Generate a question related to ${topic}`;
            const response = await openai.chat.completions.create({
                messages:[
                    {
                        role: 'system',
                        content: prompt
                    }
                ],
                model: 'gpt-3.5-turbo',
                max_tokens:100
            });
            console.log(response.choices[0].message.content);
            res.status(200).json(response.choices[0].message.content);
        } catch (error) {
            res.status(401).json(error);
        }
    }
    else{
        res.status(400).json({msg:"question is not there"});
    }
});

app.post('/api/check-answer', async (req, res) => {
    const { question, userAnswer } = req.body;
    console.log(question,userAnswer);
    
    if(userAnswer){
        try {
            const prompt = `Evaluate the following question and answer. Provide a score from 0 to 10, where 10 is completely accurate and 0 is completely inaccurate with some remarks.\n\nQuestion: ${question}\nAnswer: ${userAnswer}\nScore:`;
            const response = await openai.chat.completions.create({
                messages:[
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'gpt-3.5-turbo',
                max_tokens:100
            });
            console.log(response.choices[0].message.content);
            res.status(200).json(response.choices[0].message.content);
        } catch (error) {
            res.status(401).json(error);
        }
    }
    else{
        res.status(400).json({msg:"useranswer is not there"});
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`server running at ${process.env.PORT}`);
});