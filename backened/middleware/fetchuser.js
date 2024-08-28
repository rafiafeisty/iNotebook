var jwt=require('jsonwebtoken');
const JWT_SECRET='Harryisagood$boy';

const fetchuser = (req, res, next) => {
    // Get the token from the header
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
  
    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Please authenticate using a valid token" });
    }
  };
  


module.exports=fetchuser;