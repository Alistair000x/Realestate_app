import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

// SearchBar component for handling search queries
const types = ["buy", "rent"];

function SearchBar() {
  // State to manage the search query
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  // Switch the type of search (buy/rent)
  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  // Handle input changes and update the query state
  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
