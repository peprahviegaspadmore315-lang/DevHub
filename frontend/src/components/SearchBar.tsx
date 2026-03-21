import { useState } from 'react'

type SearchBarProps = {
  placeholder?: string
  onSearch?: (value: string) => void
}

const SearchBar = ({ placeholder = 'Search...', onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('')

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={submit} className="relative h-9">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="h-full w-full rounded-md border border-white/30 bg-white px-9 text-sm text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </form>
  )
}

export default SearchBar
