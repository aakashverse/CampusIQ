import { createContext, useContext, useState } from 'react'

const CompareContext = createContext(null)

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]) // array of college objects

  const addToCompare = (college) => {
    if (compareList.length >= 3) {
      alert('You can compare a maximum of 3 colleges')
      return
    }
    if (compareList.find((c) => c.id === college.id)) return // already added
    setCompareList((prev) => [...prev, college])
  }

  const removeFromCompare = (collegeId) => {
    setCompareList((prev) => prev.filter((c) => c.id !== collegeId))
  }

  const isInCompare = (collegeId) => compareList.some((c) => c.id === collegeId)

  const clearCompare = () => setCompareList([])

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => useContext(CompareContext)