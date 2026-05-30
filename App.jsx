
import { useState } from "react"
import { motion } from "framer-motion"

function App() {

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    protein: "",
    visceralFat: "",
  })

  const [result, setResult] = useState(null)
  const [plan, setPlan] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)

const [messages, setMessages] = useState([
  {
    sender: "ai",
    text: "Hi 👋 I'm BodyIQ AI. Ask me anything about health, protein, fitness, or nutrition."
  }
])

const [input, setInput] = useState("")
const [listening, setListening] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

 const analyzeHealth = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8001/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          age: Number(formData.age),

          height: Number(formData.height),

          weight: Number(formData.weight),

          protein: Number(formData.protein)

        })
      }
    )

    const data = await response.json()
    setMessages(prev => prev.slice(0, -1))

    setResult(data)

  }

  catch (error) {
    setMessages(prev => prev.slice(0, -1))

    console.log(error)
  }
}
const sendMessage = async () => {

  if (!input) return

  const userMessage = {
    sender: "user",
    text: input
  }

  setMessages(prev => [...prev, userMessage])

  const currentQuestion = input

  setInput("")
  const loadingMessage = {
  sender: "ai",
  text: "BodyIQ AI is thinking..."
}

setMessages(prev => [...prev, loadingMessage])

  try {

    const response = await fetch(
      "http://127.0.0.1:8001/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: currentQuestion
        })
      }
    )

    const data = await response.json()

    const aiMessage = {
      sender: "ai",
      text: data.response
    }

    setMessages(prev => [...prev, aiMessage])
    speak(data.response)

  }

  catch (error) {

    const aiMessage = {
      sender: "ai",
      text: "AI server unavailable currently."
    }

    setMessages(prev => [...prev, aiMessage])
  }

}
const speak = (text) => {

  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  utterance.rate = 1

  utterance.pitch = 1

  utterance.volume = 1

  speechSynthesis.speak(utterance)
}
const startListening = () => {

  if (!window.webkitSpeechRecognition) {
    alert("Speech recognition not supported")
    return
  }

  const recognition = new window.webkitSpeechRecognition()

  recognition.lang = "en-US"

  recognition.continuous = false

  recognition.interimResults = false

  setListening(true)

  recognition.start()

  recognition.onresult = (event) => {

    const transcript = event.results[0][0].transcript

    setInput(transcript)
  }

  recognition.onend = () => {

    setListening(false)
  }
}
const generatePlan = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8001/generate-plan",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          age: Number(formData.age),
          height: Number(formData.height),
          weight: Number(formData.weight),
          protein: Number(formData.protein)
        })
      }
    )

    const data = await response.json()

    setPlan(data)

  }

  catch (error) {

    console.log(error)

  }

}
  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="absolute w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/10 backdrop-blur-lg">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          BodyIQ AI
        </motion.h1>

        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
          Get Started
        </button>

      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 relative z-10">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl font-black leading-tight max-w-5xl mx-auto"
        >
          Futuristic AI Health Intelligence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 text-xl mt-8 max-w-3xl mx-auto"
        >
          Analyze body composition, detect health risks,
          and receive personalized AI-powered recommendations instantly.
        </motion.p>

      </section>

      {/* Main Card */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl"
      >

        <h2 className="text-4xl font-bold mb-10 text-cyan-400">
          AI Health Analyzer
        </h2>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={formData.height}
            onChange={handleChange}
            className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            name="protein"
            placeholder="Protein %"
            value={formData.protein}
            onChange={handleChange}
            className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            name="visceralFat"
            placeholder="Visceral Fat"
            value={formData.visceralFat}
            onChange={handleChange}
            className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

        </div>

        {/* Button */}
        <button
          onClick={analyzeHealth}
          className="w-full mt-10 bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl text-xl font-bold hover:scale-[1.02] transition"
        >
          Analyze With AI
        </button>
<button

  onClick={generatePlan}

  className="w-full mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition"
>
  Generate AI Plan
</button>
        {/* Results */}
        {
          result && (

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-14"
            >

              <h2 className="text-4xl font-bold text-cyan-400 mb-8">
                AI Health Report
              </h2>

              <div className="grid md:grid-cols-3 gap-6">

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
                >

                  <p className="text-slate-300 text-lg">
                    Health Score
                  </p>

                  <h1 className="text-6xl font-black text-cyan-400 mt-4">
                    {result.score}
                  </h1>

                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-400/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
                >

                  <p className="text-slate-300 text-lg">
                    BMI
                  </p>

                  <h1 className="text-6xl font-black text-blue-400 mt-4">
                    {result.bmi}
                  </h1>

                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
                >

                  <p className="text-slate-300 text-lg">
                    Status
                  </p>

                  <h1 className="text-4xl font-black text-green-400 mt-4">
                    {result.bmiStatus}
                  </h1>

                </motion.div>

              </div>

              {/* Recommendations */}

              <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

                <h3 className="text-3xl font-bold text-cyan-400 mb-6">
                  AI Recommendations
                </h3>

                <div className="space-y-4">

                  {
                    result.recommendations.map((item, index) => (

                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-black/30 border border-white/10 p-5 rounded-2xl text-slate-300"
                      >
                         {item}
                      </motion.div>

                    ))
                  }

                </div>

              </div>

            </motion.div>

          )

        }
        {
  plan && (

    <motion.div

      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}

      className="mt-10 bg-black/40 border border-white/10 p-8 rounded-3xl"
    >

      <h2 className="text-4xl font-bold text-cyan-400 mb-8">
        AI Personalized Plan
      </h2>

      <div className="space-y-6">

        <div className="bg-black/30 p-5 rounded-2xl">
          <h3 className="text-2xl font-bold mb-3">
            Workout
          </h3>

          <p>{plan.workout}</p>
        </div>

        <div className="bg-black/30 p-5 rounded-2xl">
          <h3 className="text-2xl font-bold mb-3">
            Diet
          </h3>

          <p>{plan.diet}</p>
        </div>

        <div className="bg-black/30 p-5 rounded-2xl">
          <h3 className="text-2xl font-bold mb-3">
            Sleep
          </h3>

          <p>{plan.sleep}</p>
        </div>

      </div>

    </motion.div>

  )
}

      </motion.section>
{/* Floating AI Chat */}

<div className="fixed bottom-6 right-6 z-50">

  {/* Floating Button */}

  <button

    onClick={() => setChatOpen(!chatOpen)}

    className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-3xl shadow-2xl hover:scale-110 transition"
  >
    🤖
  </button>

  {/* Chat Box */}

  {
    chatOpen && (

      <motion.div

        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}

        className="absolute bottom-20 right-0 w-[360px] h-[500px] bg-black/80 border border-cyan-400/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
      >

        {/* Header */}

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 text-xl font-bold">
          BodyIQ AI Assistant
        </div>

        {/* Messages */}

        <div className="p-5 h-[360px] overflow-y-auto space-y-4">

          {
            messages.map((msg, index) => (

              <div

                key={index}

                className={`p-4 rounded-2xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-cyan-500 ml-auto text-white"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {msg.text}
              </div>

            ))
          }

        </div>

        {/* Input */}

        <div className="p-4 border-t border-white/10 flex gap-3">

          <input
            type="text"
            placeholder="Ask AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
}}
            className="flex-1 bg-black/40 border border-white/10 p-3 rounded-xl outline-none"
          />
          <button

  onClick={startListening}

  className={`px-4 rounded-xl font-bold ${
    listening
      ? "bg-red-500"
      : "bg-purple-500"
  }`}
>
  🎤
</button>

          <button

            onClick={sendMessage}

            className="bg-cyan-500 px-5 rounded-xl font-bold"
          >
            Send
          </button>

        </div>

      </motion.div>

    )
  }

</div>
    </div>

  )
}

export default App