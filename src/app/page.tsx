'use client'
import {useState} from "react"
import { Search } from "lucide-react"
export default function Home(){
  
  const [ suggestion , setSuggestion ] = useState("")
  const [ isLoading , setIsLoading ] = useState(false)

  async function handleClick(){
      
    setIsLoading(true)
    setSuggestion("")
    
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
        
      const r = await fetch('/api/wardrobe' , {
        method: 'POST',
        body: JSON.stringify({ lat: coords.latitude, lon: coords.longitude })
      });
      
      if (!r.ok) {
        console.error('API Error:', r.status, r.statusText);
        setSuggestion('Failed to get outfit suggestion. Please try again.');
        setIsLoading(false)
        return;
      }
      
      const data = await r.json() 
      setSuggestion(data.outfit)
      setIsLoading(false)
    })
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black dark">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h3 className="text-white text-2xl font-semibold mb-12">What should I wear?</h3>

        <button 
          onClick={handleClick} 
          disabled={isLoading}
          className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isLoading && <Search className="w-4 h-4" />}
          {isLoading ? "thinking..." : "Search"}
        </button>
        
        {suggestion && 
        <div className="text-white text-lg font-semibold mt-8 text-left max-w-lg border-white/10 border-[1px] rounded-4xl py-3 px-4">
          {suggestion}
        </div>}
        
      </div>
    </div>
  )
}