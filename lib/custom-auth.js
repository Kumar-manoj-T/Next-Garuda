// lib/custom-auth.js

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin@123"
const SESSION_KEY = "admin_session"
const TOKEN_EXPIRY_HOURS = 24

/**
 * Attempts to log in the user with hardcoded credentials.
 * If successful, stores a session object in localStorage with an expiry.
 * @param {string} username
 * @param {string} password
 * @returns {{success: boolean, message?: string}}
 */
export function loginUser(username, password) {
  if (typeof window === "undefined") {
    return { success: false, message: "Cannot log in on server side." }
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const expiresAt = Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000 // 24 hours from now
    const session = {
      isAuthenticated: true,
      token: "dummy_admin_token_" + Math.random().toString(36).substring(2, 15), // Simple dummy token
      expiresAt: expiresAt,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true }
  } else {
    return { success: false, message: "Invalid username or password." }
  }
}

/**
 * Logs out the user by removing the session from localStorage.
 */
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}

/**
 * Checks if the user is currently authenticated and if the session has not expired.
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false // Always false on the server
  }
  try {
    const sessionString = localStorage.getItem(SESSION_KEY)
    if (!sessionString) {
      return false
    }
    const session = JSON.parse(sessionString)
    if (session.isAuthenticated && session.expiresAt > Date.now()) {
      return true
    } else {
      // Session expired or invalid, clear it
      localStorage.removeItem(SESSION_KEY)
      return false
    }
  } catch (e) {
    console.error("Error parsing session from localStorage:", e)
    localStorage.removeItem(SESSION_KEY) // Clear corrupted session
    return false
  }
}
