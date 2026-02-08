const APIError = require("../utils/APIError")

const allowed = ["user", "admin"];

const restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new APIError("Invalid User Type", 403);
        }
        next();
    }
}

module.exports = restrictTo;