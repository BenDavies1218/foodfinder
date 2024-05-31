# foodfinder

## Have you every been stuck unable to decide what to eat?

- FoodFinder takes all guess work away. Simply open the application select 1 or more categories from Cafe, Resturant, Bar, Fast Food or Dessert and search either near you or by address.

### Tech Stack

- NodeJS
- React
- Vite
- Netlify

### Features

- App uses the users IP address and create a GEO Location Request to Geoapify That returns users longitude and latitude.
- App uses the longitude and latitude to make another request to Geoapify and return the appropriate data.
- Users can then save Food venues to there favourites.

### Routes

- "/" Home page
- "/search" Search for Food
- "/favourites" users favourite venues

### Local Storage

- Users favourites

### Context

- Users Longitude and Latitude

### Useful Links

- <a href="https://apidocs.geoapify.com/docs/places/#about"> Place Location (Geoapify)
- <a href="https://apidocs.geoapify.com/docs/ip-geolocation/#about"> IP Geolocation (Geoapify)

### Maybe Features

- Users can search for venues outside of there IP location.
- Search for things over than food