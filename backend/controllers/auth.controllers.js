import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

// ------------------ SIGN UP ------------------
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body

    // Check username
    const checkUserByUserName = await User.findOne({ userName })
    if (checkUserByUserName) {
      return res.status(400).json({ message: "Username already exists" })
    }

    // Check email
    const checkUserEmail = await User.findOne({ email })
    if (checkUserEmail) {
      return res.status(400).json({ message: "Email already exists" })
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword
    })

    // Generate token
    const token = await genToken(user._id)

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false // Set to true in production with HTTPS
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ message: `Signup error: ${error.message}` })
  }
}

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false // Set to true in production with HTTPS
    })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` })
  }
}

// ------------------ LOGOUT ------------------
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Logout error: ${error.message}` })
  }
}
