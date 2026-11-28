const routes = require("../config/routes.json");

// Remove trailing slashes from a configured prefix.
function normalizePrefix(prefix) {
    if (prefix === "/") {
        return "/";
    }

    return prefix.replace(/\/+$/, "");
}

// Check whether a path matches a prefix at a path boundary.
function matchesPrefix(pathname, prefix) {
    return pathname === prefix || pathname.startsWith(prefix + "/");
}

// Remove the configured prefix from the request path.
function rewritePath(pathname, stripPrefix) {
    if (!stripPrefix) {
        return pathname;
    }

    if (pathname === stripPrefix) {
        return "/";
    }

    if (pathname.startsWith(stripPrefix + "/")) {
        return pathname.slice(stripPrefix.length);
    }

    return pathname;
}

function match(path) {
    // Separate pathname from query parameters.
    const queryIndex = path.indexOf("?");
    const pathname = queryIndex === -1
        ? path
        : path.slice(0, queryIndex);

    const query = queryIndex === -1
        ? ""
        : path.slice(queryIndex);

    // Sort routes from longest prefix to shortest prefix.
    const sortedRoutes = [...routes].sort((a, b) => {
        return normalizePrefix(b.prefix).length -
               normalizePrefix(a.prefix).length;
    });

    for (const route of sortedRoutes) {
        const prefix = normalizePrefix(route.prefix);

        if (matchesPrefix(pathname, prefix)) {
            const rewrittenPath = rewritePath(
                pathname,
                route.stripPrefix
            );

            return {
                upstream: route.upstream,
                rewrittenPath: rewrittenPath + query
            };
        }
    }

    return null;
}

module.exports = { match };