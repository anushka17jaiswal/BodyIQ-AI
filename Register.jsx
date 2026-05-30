import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = () => {

    if (name.length < 3) {

      setError("Name must be at least 3 characters")
      return
    }

    if (!email.includes("@")) {

      setError("Invalid email address")
      return
    }

    if (password.length < 6) {

      setError("Password must be at least 6 characters")
      return
    }

    setError("")

    navigate("/analyzer")
  }

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">

      {/* Glow Background */}

      <div className="absolute w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full top-20 left-20"></div>

      <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full bottom-20 right-20"></div>

      <motion.div

        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}

        className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl p-12 rounded-[40px] shadow-2xl w-[430px]"
      >

        <h1 className="text-5xl font-black text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Create Account
        </h1>

        <p className="text-slate-400 text-center mt-4">
          Join BodyIQ AI Today
        </p>

        {/* Inputs */}

        <div className="mt-10 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-400"
          />

        </div>

        {/* Error */}

        {
          error && (

            <p className="text-red-400 mt-4 text-center">
              {error}
            </p>

          )
        }

        {/* Button */}

        <button

          onClick={handleRegister}

          className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl text-xl font-bold hover:scale-[1.02] transition"
        >
          Register
        </button>

        {/* Login Redirect */}

        <p
          onClick={() => navigate("/")}

          className="text-center text-cyan-400 mt-6 cursor-pointer hover:underline"
        >
          Already have an account? Login
        </p>

      </motion.div>

    </div>

  )
}

export default Register