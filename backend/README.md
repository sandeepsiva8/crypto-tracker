#node setup

cd backend
npm install

#create .env file
MONGODB_URL= #your mongodb database
API_URL= #livecoinwatch url (https://api.livecoinwatch.com/coins/single)
API_KEY= #your livecoinwatch api here
PORT= #port in which ur application should run

#start application
node index.js