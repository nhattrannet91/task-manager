const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

const auth = async function (req, res, next) {
   try {
      const token = req.get("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
      if (!user) {
         throw new Error("Failed to authenticate");
      }

      req.token = token;
      req.user = user;
      next();
   } catch (error) {
      res.status(401).send({error});
   }
}

module.exports = auth;