const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife, loggedBySocial, isadmin, role) => {
  return new Promise((resolve, reject) => {
    //role 1: kols, role 2: brands, role 3: admin
    // Định nghĩa những thông tin của user
    const userData = {
      id: user.id,
      is_social_login: loggedBySocial,
      is_admin: isadmin,
      role: role
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log("Error cua jwt ",error);
        if(error.name === 'TokenExpiredError') {
          const payload = jwt.verify(token, secretKey, {ignoreExpiration: true} );
          resolve("expired");
          // your code
        }
        else
            return reject(error);
      }
      resolve(decoded);
    });
  });
}


module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
