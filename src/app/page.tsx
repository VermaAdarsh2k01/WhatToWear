'use client'
import {useState, useEffect} from "react"
import { Search } from "lucide-react"
import AITextLoading from "@/components/kokonutui/ai-text-loading"
export default function Home(){
  
  const [ suggestion , setSuggestion ] = useState("")
  const [ isLoading , setIsLoading ] = useState(false)
  const [ isMounted , setIsMounted ] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  async function handleClick(){
      
    setIsLoading(true)
    setSuggestion("")
    
    
    if (typeof window !== 'undefined' && navigator.geolocation) {
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
      }, (error) => {
        console.error('Geolocation error:', error);
        setSuggestion('Unable to get your location. Please enable location services and try again.');
        setIsLoading(false)
      })
    } else {
      setSuggestion('Geolocation is not supported by this browser.');
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black dark">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h3 className="text-white text-2xl font-semibold mb-12">What should I wear?</h3>
          <button 
            disabled
            className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    )
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
        
        {isLoading && (
          <div className="mt-8 max-w-lg py-3 px-4 animate-pulse">
            
            {/* Loading indicator at bottom */}
            <div className="flex items-center justify-center">
              <AITextLoading 
                texts={[
                  "Checking the weather...",
                  "Analyzing temperature...",
                  "Selecting perfect outfit...",
                  "Almost ready..."
                ]}
                className="text-white/60 text-sm"
                interval={1200}
              />
            </div>
            
          </div>
        )}
        
        {suggestion && !isLoading && 
        <div className="text-white text-lg font-light mt-8 text-left max-w-lg  rounded-4xl py-3 px-4">
          {suggestion}
        </div>}
        
      </div>
    </div>
  )
}