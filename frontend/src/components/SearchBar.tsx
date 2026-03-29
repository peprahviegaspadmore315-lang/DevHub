import SearchComponent from '@/components/ui/animated-glowing-search-bar'

type SearchBarProps = {
  placeholder?: string
  onSearch?: (value: string) => void
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const SearchBar = ({
  placeholder = 'Search topics, lessons, or courses...',
  onSearch,
  value,
  onChange,
  className,
}: SearchBarProps) => {
  return (
    <SearchComponent
      placeholder={placeholder}
      onSearch={onSearch}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}

export default SearchBar
