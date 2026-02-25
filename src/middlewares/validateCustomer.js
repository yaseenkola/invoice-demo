const validateCustomer = (req, res, next) => {
  let userData = req.body; // Extract user data from the request body
  let validator = require("validator");
  // Perform input validations
  // Validate name: must be at least 3 characters
  if (!userData.name || userData.name.trim().length <= 3) {
    return res.status(400).json({
      message: "Name should be at least 3 characters",
    });
  }

  // Validate email: must be present and in valid format
  if (!userData.email || !validator.isEmail(userData.email)) {
    return res.status(400).json({
      message: "Email cannot be blank and should be in correct format",
    });
  }

  // Validate phone: must be present and valid Indian mobile number
  const phone = userData.phone;
  if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
    return res.status(400).json({
      message: "Phone number should be correct",
    });
  }
  // Validate credit Limit: must be an integer 0 and 1,00,000
  const creditLimit = userData.creditLimit;
  if (
    creditLimit === undefined ||
    !Number.isInteger(creditLimit) ||
    creditLimit < 0 ||
    creditLimit > 100000
  ) {
    return res.status(400).json({
      message: "Credit Limit should be between 0 and 1,00,000",
    });
  }

  next();
};

module.exports = validateCustomer;