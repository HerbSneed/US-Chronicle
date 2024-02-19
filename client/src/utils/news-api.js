var apiKey = "72854b184e9b4fb88d7b85d9362f3e4a";
var apiKey2 = "c8b7b4b0c8b04b6e9b7b4b0c8b04b6e9";
var apiKey3 = "0aa43dd5018e4447ac45d86caf10d084";

export const getSearchedHeadlines = async (searchQuery) => {
  return fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&language=en&pageSize=100&apiKey=${apiKey3}`);
}

export const getUserHeadlines = async (userCategory) => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=${userCategory}&pageSize=100&apiKey=${apiKey3}`);
};

export const getUsHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=general&pageSize=100&apiKey=${apiKey3}`);
}

export const getBusinessHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=business&pageSize=100&apiKey=${apiKey3}`);
};

export const getSportsHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=sports&pageSize=100&apiKey=${apiKey3}`);
};

export const getHealthHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=health&pageSize=100&apiKey=${apiKey3}`);
};

export const getEntertainmentHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=entertainment&pageSize=100&apiKey=${apiKey3}`);
};

export const getTechnologyHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=technology&pageSize=100&apiKey=${apiKey3}`);
};

export const getScienceHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=US&category=science&pageSize=100&apiKey=${apiKey3}`);
};
