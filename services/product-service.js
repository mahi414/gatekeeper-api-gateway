
const http = require("node:http");

// 1. Configuration
const PORT = Number(process.env.PORT) || 4002;

const configuredDelay = Number(process.env.DELAY_MS ?? 0);

const DELAY_MS =
    Number.isFinite(configuredDelay) && configuredDelay >= 0
        ? configuredDelay
        : 0;

const FAIL_MODE = process.env.FAIL_MODE === "true";

// 2. Helper function for artificial delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 3. Helper function for JSON responses
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

// 4. Create HTTP server
const server = http.createServer(async (req, res) => {

    try {
        // Parse URL, including any query parameters
        const url = new URL(req.url, "http://localhost");

        // Match GET /products/:id
        const match = url.pathname.match(/^\/products\/([^/]+)$/);

        if (req.method !== "GET" || !match) {
            return sendJson(res, 404, {
                error: "Product route not found"
            });
        }

        // Extract product ID
        const productId = match[1];

        // Simulate slow backend response
        await delay(DELAY_MS);

        // Simulate backend failure
        if (FAIL_MODE) {
            return sendJson(res, 503, {
                error: "Product service temporarily unavailable",
                servedBy: PORT
            });
        }

        // Successful response
        return sendJson(res, 200, {
            id: productId,
            name: `Product ${productId}`,
            price: 999,
            servedBy: PORT
        });

    } catch (error) {
        console.error("Product Service Error:", error.message);

        if (!res.headersSent) {
            sendJson(res, 500, {
                error: "Internal server error"
            });
        }
    }
});

// 5. Start server
server.listen(PORT, () => {
    console.log(
        `Product Service running on port ${PORT} | Delay: ${DELAY_MS}ms | Failure: ${FAIL_MODE}`
    );
});
