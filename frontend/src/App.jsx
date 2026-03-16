import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignInSide from './pages/SignInSide'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInSide />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App