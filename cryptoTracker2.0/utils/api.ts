const API_KEY = process.env.API_KEY;

export const fetchCoins = async (currency: string = 'usd') => {
 const options = {
  method: 'GET',
  headers: {
   accept: 'application/json',
   'x-cg-pro-api-key': API_KEY,
  },
 };

 try {
  const response = await fetch(
   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`
  );
  if (!response.ok) {
   throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
 } catch (error) {
  console.error('Error fetching coins:', error);
  throw error;
 }
};
