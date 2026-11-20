import { useState, useContext, memo } from 'react'
import { SettingContext } from '../SettingContext.js'

function NoteCard({ id, title, body, onDelete }) {
  const [isOpen, setIsOpen] = useState(false)
  const {largeText} = useContext(SettingContext)

  return (
    <div>
      <h3
        className={
          largeText
            ? 'pr-8 text-[28px] font-normal break-words'
            : 'pr-8 text-[22px] font-normal break-words'
       }
      >
        {title}
      </h3>
      
      {isOpen && (<p
          className={
            largeText
              ? 'mt-3 text-[21px] break-words whitespace-pre-wrap text-[#4d4d4d]'
              : 'mt-3 text-[17px] break-words whitespace-pre-wrap text-[#4d4d4d]'
          }
        >
          {body}
        </p>)}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#b83f45] text-sm hover:underline cursor-pointer"
      >
        {isOpen ? "Show less" : "Show more"}
      </button>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="absolute top-4 right-5 cursor-pointer text-[26px] leading-none text-[#949494] hover:text-[#c18585]"
      >
        ×
      </button>
    </div>
  )
}

export default memo(NoteCard)