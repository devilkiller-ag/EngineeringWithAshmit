const { validateToken } = require('../services/authentication');


function checkForAuthenticationCookie() {
    return (req, res, next) => {
        // This middleware only checks if the user is logged in or not. If not, it doesn't restricts user from accessing 
        // further middlewares/routes in the request-response cyle but sends NULL in the req.user value.

        /** Authentication using cookies - only works for browser, and not for mobile apps, desktop apps, etc. */
        const tokenCookieValue = req.cookies?.token;
        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }

        try {
            // If the token is present, decode the token and get the user details.
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) { }

        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
};
