import { Search } from 'lucide-react';

// SearchBar – a text input with a search icon inside it
// onChange receives the new string value
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position:'relative', display:'inline-flex', alignItems:'center' }}>
      <Search size={15} style={{ position:'absolute', left:10, color:'#94a3b8', pointerEvents:'none' }} />
      <input
        type="text"
        className="form-control"
        style={{ paddingLeft:32, minWidth:220 }}
        placeholder={placeholder || 'Search…'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;

