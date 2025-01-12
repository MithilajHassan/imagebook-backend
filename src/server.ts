import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import userRoute from './routes/userRoutes'
import cors from 'cors'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 8001

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api', userRoute)

app.listen(port, () => console.log('Server started at: http://localhost:' + port))