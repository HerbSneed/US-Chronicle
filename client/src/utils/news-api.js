var apiKey = "72854b184e9b4fb88d7b85d9362f3e4a";
var apiKey2 = "c8b7b4b0c8b04b6e9b7b4b0c8b04b6e9";
var apiKey3 = "0aa43dd5018e4447ac45d86caf10d084";

export const getSearchedHeadlines = async (searchQuery) => {
  return fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&language=en&apiKey=${apiKey}`);
}

export const getUserHeadlines = async (userCategory) => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=${userCategory}&apiKey=${apiKey}`);
};

export const getUsHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=general&apiKey=${apiKey}`);
}

export const getBusinessHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=business&apiKey=${apiKey}`);
};

export const getSportsHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=sports&apiKey=${apiKey}`);
};

export const getHealthHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=health&apiKey=${apiKey}`);
};

export const getEntertainmentHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=entertainment&apiKey=${apiKey}`);
};

export const getTechnologyHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=technology&apiKey=${apiKey}`);
};

export const getScienceHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=science&apiKey=${apiKey}`);
};
