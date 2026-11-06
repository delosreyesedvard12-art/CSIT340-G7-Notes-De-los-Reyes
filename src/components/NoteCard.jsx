import { useState } from 'react'

function NoteCard({ title, body }) {
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      <h3 className="font-bold text-lg mb-2 pr-6">{title}</h3>
      {showMore && <p className="text-sm text-gray-700 mb-3">{body}</p>}
      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="text-[#b83f45] text-sm hover:underline cursor-pointer"
      >
        {showMore ? "Show less" : "Show more"}
      </button>
    </div>
  )
}

export default NoteCard