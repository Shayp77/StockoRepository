import { useState, useEffect } from "react"

export const Text = () =>
{
  const [text, settext] = useState("")
  useEffect(() =>
  {
    console.log("Componenet mounted")
    return () =>
    {
      console.log("unmount")
    }
  }, [])
  return (
    <div>
      <h1>Aus</h1>
      <h1>Tesw</h1>
      <input onChange={(event) =>
      {
        settext(event.target.value)
      }} />
    </div>
  )
}