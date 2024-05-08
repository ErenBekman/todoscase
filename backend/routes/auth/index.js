const router = require("express").Router();
const httpStatus = require("http-status");
const { User } = require("../../models");
let {
    auth,
    validate: { body, express_validate },
} = require("../../middleware");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../../utils/helper");

router.post("/register", body("email").isEmail(), body("password").isString(), express_validate, (req, res) => {
    let { email, password } = req.body;
    password = passwordToHash(password);

    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }

        let newUser = new User({ email, password, username: email.split("@")[0] });

        newUser.save().then((user) => {
            res.status(httpStatus.CREATED).json(user);
        }).catch((error) => {
            res.status(httpStatus.BAD_REQUEST).json(error);
        });
    });
});

router.post("/login", body("email").isEmail(), body("password").isString(), express_validate, (req, res) => {
    let { email, password } = req.body;
    password = passwordToHash(password);

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        user = {
            ...user.toObject(),
              access_token: generateAccessToken(user),
              refresh_token: generateRefreshToken(user),
          };

          res.status(httpStatus.OK).json(user);
    });
});

router.get("/me", auth(), (req, res) => {
    res.status(httpStatus.OK).json(req.user);
});

module.exports = router;



