const http = require("node:http");
const PORT = Number(process.env.PORT) || 4001;
const server = http.createServer((req, res) => {
    console.log("Request received");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);
    if (req.method === "GET" && req.url === "/users/101") {

   res.writeHead(200, {
    "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        id: 101,
        name: "Mahi",
        servedBy: PORT
    }));

    } else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            error: "Route not found"
        }));

    }
});
server.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
