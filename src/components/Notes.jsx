import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import NoteCard from './NoteCard'

const API_URL = import.meta.env.VITE_API_URL

function Notes() {

    const [notes, setNotes] = useState([])  
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    const [form, setForm] = useState(() => {
      const savedDraft = localStorage.getItem('draft')
      if (!savedDraft) return { title: "", body: "" }

      let draft
      try {
        draft = JSON.parse(savedDraft)
      } catch (error) {
        console.error('Unable to load saved draft:', error)
        return { title: "", body: "" }
      }

      if (
        draft &&
        typeof draft.title === 'string' &&
        typeof draft.body === 'string'
      ) {
        return { title: draft.title, body: draft.body }
      }

      return { title: "", body: "" }
    })
    const [searchQuery, setSearchQuery] = useState("")
    const titleRef = useRef(null)

    useEffect(() => {
      let ignore = false
      
        async function loadNotes() {
      try {
        const res = await fetch(API_URL + '/notes')
        if (!res.ok) {
          throw new Error('The server answered ' + res.status)
        }
        const data = await res.json()
        if (!ignore) setNotes(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      }
      if (!ignore) setLoading(false)
    }
 
    loadNotes()
    return () => {
      ignore = true
    }
  }, [])


    useEffect(() => {
        const id = setTimeout(() => {
          localStorage.setItem('draft', JSON.stringify(form))
          console.log('draft saved:', form.title)
        }, 1000)
        return () => clearTimeout(id)
      },[form])

      
    const handleChange = (e) => {
        const {name, value } = e.target;
        setForm((prev)=>({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
            
        const trimmedTitle = form.title.trim();
        const trimmedBody = form.body.trim();

        if (trimmedTitle === "" || trimmedBody === "") {
            return
        }

    try {
      const res = await fetch(API_URL + '/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle, body: trimmedBody }),
      })
      if (!res.ok) {
        throw new Error('The server answered ' + res.status)
      }
      const newNote = await res.json()
      setNotes((prev) => [...prev, newNote])
      setForm({ title: '', body: '' })
      titleRef.current.focus()
    } catch (err) {
      setError(err.message)
    }
    }

 const handleDelete = useCallback(async (id) => {
        try {
          const res = await fetch(API_URL + '/notes/' + id, {
            method: 'DELETE',
          })
          if (!res.ok) {
            throw new Error('The server answered ' + res.status)
          }
          setNotes((prev) => prev.filter((note) => note.id !== id))
        } catch (err) {
          setError(err.message)
        }
    }, [])
    
    const visibleNotes = useMemo(() => {
    console.log('filtering')
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [notes, searchQuery])

  return (
    <div className="grid min-h-screen grid-cols-[420px_1fr]">
        <aside className="sticky top-0 flex h-screen flex-col gap-5 bg-white px-8 py-9 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]">
        <h1 className="text-[72px] leading-none font-extralight text-[#b83f45]">
            notes
        </h1>

        <div>
            <p className="mb-2 text-[13px] font-normal tracking-wide text-[#949494]">SEARCH</p>
            <input
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[52px] w-full border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
          />
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <p className="text-[13px] font-normal tracking-wide text-[#949494]">NEW NOTE</p>
          <input
            ref={titleRef}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="h-[52px] w-full border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
          />
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Write your note"
            className="h-[120px] w-full resize-none py-3 border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
          />

          <button
            type="submit"
           className="h-[50px] cursor-pointer bg-[#b83f45] text-[17px] font-normal text-white hover:bg-[#a33439]"
          >
            Add note
          </button>
        </form>
    </aside>
      <section className="px-12 py-11">
        <h2 className="mb-6 text-3xl">All notes</h2>

    {loading && <p className="text-lg text-[#949494]">Loading notes...</p>}
        {error && <p className="text-lg text-[#b83f45]">{error}</p>}
        {!loading && !error && visibleNotes.length === 0 && (
            <p className="text-lg text-[#949494]">
              {notes.length === 0 ? "No notes found" : "No notes match your search"}
            </p>
        )}
        
        <ul className="grid grid-cols-3 items-start gap-5">
            {visibleNotes.map((note) => (
              <li key={note.id} className="relative min-h-32 bg-white px-6 py-5 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]">
                <NoteCard
                id={note.id}
                title={note.title}
                body={note.body}
                onDelete={handleDelete}
              />
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }
   
  export default Notes
            