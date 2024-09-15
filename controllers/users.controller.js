const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const requestStatus = require("../utils/requestStatus");
const validator = require("validator");
const newToken = require("../utils/newToken");
const nodemailer = require("nodemailer");

const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check empty fields
  if (!name || !email || !password) {
    return next(
      appError.create(400, requestStatus.FAIL, "All fields are required")
    );
  }

  // check if user already exists
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return next(
      appError.create(400, requestStatus.FAIL, "This User Already exists")
    );
  }

  // check email format
  if (!validator.isEmail(email)) {
    return next(
      appError.create(400, requestStatus.FAIL, "Invalid email format")
    );
  }

  // check password, add user to database
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return next(appError.create(400, requestStatus.FAIL, "Weak password"));
  }

  // hash password
  const hashPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUND) || 10
  );

  // create new user
  const newUser = new User({
    name,
    email,
    password: hashPassword,
    confirmTokenExpires: Date.now() + 3600000,
  });

  // generate new toten
  const token = await newToken({
    email,
    userId: newUser._id,
    role: newUser.role,
  });
  newUser.confirmToken = token;
  await newUser.save();

  // send confirm email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: newUser.email,
    subject: "Confirm Your Email",
    text: `Please confirm your email by clicking the following link: http://localhost:4000/api/users/confirm/${token}`,
  });

  return res.status(201).json({
    status: requestStatus.SUCCESS,
    code: 201,
    message: "Registration successful",
    token,
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // check email and password
  if (!email || !password) {
    return next(
      appError.create(400, requestStatus.FAIL, "All fields are required")
    );
  }

  // check user
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(appError.create(400, requestStatus.FAIL, "User not found"));
  }

  // check password
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return next(appError.create(400, requestStatus.FAIL, "Wrong password"));
  }

  // check if user is active
  if (!user.isActive) {
    return next(
      appError.create(
        403,
        requestStatus.FAIL,
        "Account is not active. Please verify your email."
      )
    );
  }

  // generate new token
  const token = await newToken({ email, userId: user._id, role: user.role });

  return res.status(200).json({
    status: requestStatus.SUCCESS,
    code: 200,
    message: "Successful login",
    token,
  });
});

const getUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
});

const confirmEmail = asyncWrapper(async (req, res, next) => {
  const token = req.params.token;

  // find the user
  const user = await User.findOne({
    confirmToken: token,
    confirmTokenExpires: { $gt: Date.now() },
  });

  // check user if isn't exists
  if (!user || user.confirmTokenExpires < Date.now()) {
    if (user) {
      const newToken = await newToken({
        email: user.email,
        userId: user._id,
        role: user.role,
      });
      user.confirmToken = newToken;
      user.confirmTokenExpires = Date.now() + 3600000;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Resend Confirmation Email",
        text: `Please confirm your email by clicking the following link: http://localhost:4000/api/users/confirm/${newToken}`,
      });

      return res.status(200).json({
        status: requestStatus.SUCCESS,
        code: 200,
        message: "Token expired. A new confirmation email has been sent.",
      });
    }
    return next(
      appError.create(
        400,
        requestStatus.FAIL,
        "Token is invalid or has expired"
      )
    );
  }

  // confirm email
  user.isActive = true;
  user.confirmToken = undefined;
  user.confirmTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: requestStatus.SUCCESS,
    code: 200,
    message: "Email confirmed successfully, your account is now active",
  });
});

module.exports = { register, login, getUsers, confirmEmail };
