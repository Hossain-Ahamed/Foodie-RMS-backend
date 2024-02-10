const validateMobileNumber = (number) => {
    const regex = /^(?:\+88)?01[3-9][0-9]{8}$/;
  
    // Remove "+88" if it exists
    const formattedNumber = number.replace(/^\+88/, "");
    return formattedNumber
  };

module.exports = {
    validateMobileNumber
}