// Declare variables
let favoritesNum = document.querySelector('#favoritesNum');
let navItems = document.querySelectorAll('nav ul li');
let navFeed = document.querySelector('#navFeed');
let navFavorites = document.querySelector('#navFavorites');
let feed = document.querySelector('#feed');
let favorites = document.querySelector('#favorites');
let favoritesPosts = document.querySelectorAll('#favorites .post');
let saveBtn = document.getElementsByClassName('fa-heart');
let removeBtn = document.getElementsByClassName('fa-trash');

// Default Favorites Number in the Navigation
favoritesAmount = 0;
favoritesNum.innerHTML = favoritesAmount;

// Show No Favorites Message if there aren't any favorited posts 
if (favoritesPosts.length === 0) {
  noFavorites();
} else {
  // Hide No Favorites Message
  document.getElementById('noFavorites').style.display = "none";
}

// Default No Favorite Message
function noFavorites() {
  let noFavoritesMessage = '';
  noFavoritesMessage +=
    '<div id="noFavorites">' +
    '<p>No favorites yet.</p>' +
    '</div>';
  favorites.innerHTML = noFavoritesMessage;
}

// HTTP Request
let xhttp = new XMLHttpRequest();
xhttp.open('GET', 'https://www.reddit.com/r/analog/top/.json', true);

xhttp.onload = function(){
  if(this.status == 200){
    let posts = JSON.parse(this.responseText);
    let feedList = '';
    let savedList = '';
    let favoritesList;
    
    // Loop through posts 
    for(let i = 0; i < posts.data.children.length; i++) {
      let thumbnail = posts.data.children[i].data.thumbnail;
      let title = posts.data.children[i].data.title;
      let author = posts.data.children[i].data.author;

      feedList +=
        '<div class="post">' +
        '<div class="image-container">' +
        '<img src="'+thumbnail+'">' +
        '<i class="icon fas fa-heart btn"></i>' +
        '</div>' + 
        '<p class="title">'+title+'</p>' +
        '<p class="author"><i class="fas fa-user"></i>'+author+'</p>' +
        '</div>';
    }
    // Add Posts to Feed
    feed.innerHTML = feedList;

    // Save to Favorites
    for(let i = 0; i < saveBtn.length; i++) {
      saveBtn[i].addEventListener('click', saveToFavorites);
    }

    function saveToFavorites() {
      // Hide Default No Favorites Message
      document.getElementById('noFavorites').style.display = "none";

      // Get the closest post to the Save Button
      savedList = this.closest(".post");

      // Copy from Feed to save to Favorites
      favoritesList = savedList.cloneNode(true);

      // Add List to Favorites
      favorites.appendChild(favoritesList);

      // Increment Favorites Number in the Navigation
      favoritesAmount++;
      favoritesNum.innerHTML = favoritesAmount;

      // Swap Icons
      let favoritesPostsIcon = document.querySelectorAll('#favorites .post .image-container .icon');
      for(let i = 0; i < favoritesPostsIcon.length; i++) {
        favoritesPostsIcon[i].classList.remove("fa-heart");
        favoritesPostsIcon[i].classList.add("fa-trash");
      }

      // Remove Posts from Favorites
      for(let i = 0; i < removeBtn.length; i++) {
        removeBtn[i].addEventListener('click', removePost);
      }
    }
  }
}

xhttp.send();

function removePost() {
  savedList = this.closest(".post");
  // Remove List from Favorites
  favorites.removeChild(savedList);

  // Decrement Favorites Number in the Navigation
  favoritesAmount--;
  favoritesNum.innerHTML = favoritesAmount;

  if (favoritesAmount === 0) {
    // Show Default No Favorites Message
    noFavorites();
  } else {
    // Hide No Favorites Message
    document.getElementById('noFavorites').style.display = "none";
  }
}

// Navigation
for(let i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener('click', activateNavItem);
}

function activateNavItem() {
  for(let i = 0; i < navItems.length; i++) {
    // Remove Active Class
    navItems[i].classList.remove('active');
  }
  // Add Active Class
  this.classList.add('active');

  // Scroll to Top
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

// Show Feed, Hide Favorites
navFeed.addEventListener('click', function(){
  favorites.classList.remove('active');
  feed.classList.add('active');
});

// Show Favorites, Hide Feed
navFavorites.addEventListener('click', function(){
  feed.classList.remove('active');
  favorites.classList.add('active');
});
