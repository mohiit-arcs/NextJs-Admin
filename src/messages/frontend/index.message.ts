const emailFormValidation = {
  invalid: "Please enter a valid email address",
  required: "Please enter your email address",
};

const passwordFormValidation = {
  required: "Please enter your password",
  minChar: "It should include atleast 6 characters",
};

const phoneNumberFormValidation = {
  invalid: "Please enter a valid 10 digit phone number",
  required: "Please enter phone number",
};

const zipCodeFormValidation = {
  invalid: "Please enter a valid 6 digit zipcode",
  required: "Please enter zipcode",
};

export const messages = {
  form: {
    validation: {
      name: {
        required: "Please enter name",
      },
      email: emailFormValidation,
      password: passwordFormValidation,
      role: {
        required: "Please select role",
      },
      image: {
        required: "Please select image",
      },
      phoneNumber: phoneNumberFormValidation,
      street: {
        required: "Please enter street",
      },
      city: {
        required: "Please enter city",
      },
      zipCode: zipCodeFormValidation,
      state: {
        required: "Please enter state",
      },
      country: {
        required: "Please enter country",
      },
      restaurant: {
        required: "Please select restaurant",
      },
      menuCategory: {
        required: "Please select category",
      },
    },
  },
  error: {
    badResponse: "There is some internal problem will be resolved soon!",
    wrongFileType: "Please upload image file of type .jpg or .png",
  },
};
