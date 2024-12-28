
const { getUser } = require("../service/auth");

async function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if (!tokenCookie)
        return next();

    const token = tokenCookie
    const user =getUser(token);
    if (!user) {
    return next();  // If token is invalid, proceed to the next middleware
  }

    req.user=user;
    return next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect("/login");

        if (!roles.includes(req.user.role)) // Ensure 'role' is correct
            return res.status(403).json({ error: "Unauthorized" });

        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};
