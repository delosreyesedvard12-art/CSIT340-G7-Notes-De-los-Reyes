import {useEffect, useState} from 'react'
import {SettingContext} from './SettingContext'
import Notes from './components/Notes'
import Info from './components/Info'

function App() {
  const [largeText, setLargeText] = useState(
    () => localStorage.getItem('largeText') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('largeText', String(largeText))
  }, [largeText])

  return (
    <SettingContext value={{ largeText, setLargeText }}>
      <div className="bg-[#f5f5f5] font-light text-[#111]">
        <Notes />
        <Info name="Edvard Antony L. De los Reyes" />
      </div>
    </SettingContext>
  )
}
 
export default App