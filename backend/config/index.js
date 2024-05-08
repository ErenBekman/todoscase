require("dotenv").config();
const config = {
    jwt: {
        secret: "secretkey",
    },
    PASSWORD_HASH: "eyJpZCI6NiwiaWF0IjoxNjY0NTUwMjc5LCJleHAiOjE2NjUxNTUwNzl9Yfuj25re4HZVqccyxUmDssNXx2hB5rUSGCNGeNA",
    REFRESH_HASH: "eyJpZCI6NiwiaWF0IjoxNjY0NTUwMjc5LCJleHAiOjE2NjUxNTUwNzl9Yfuj25re4HZVqc10$J1E2FpzW8zJJH1CofJtBHO",
    timezone: "+03:00",
};

module.exports = config;