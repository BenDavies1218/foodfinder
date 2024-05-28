export default function FavouritesPage() {
  return (
    <>
      <div className="container">
        <h2>Favourites</h2>
        <div className="filterContainer">
          <label for="filter">Filter By</label>
          <select name="filter" id="filterBox">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button type="submit">Submit</button>
        </div>
      </div>
    </>
  );
}
