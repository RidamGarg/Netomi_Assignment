let validators = [];
let allCountries = [];
const selectCountry = document.getElementById("country");
const selectState = document.getElementById("state");
const contact = document.getElementById("contact");
const name = document.getElementById("name");
const email = document.getElementById("email");
const dob = document.getElementById("dob");
const button = document.getElementById("submit");

window.addEventListener("message", function (event) {
  if (event.data.validators) {
    validators = event.data.validators;
    console.log(event.data);
  }
});

function getAllCountries() {
  fetch(
    "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json"
  )
    .then((res) => res.json())
    .then((result) => {
      allCountries = result;
      result.forEach((element) => {
        const option = document.createElement("option");
        option.textContent = element.name;
        option.value = element.code3;
        selectCountry.appendChild(option);
      });
    });
}

selectCountry.addEventListener("change", () => {
  const code = selectCountry.value;
  console.log(code);
  const states = allCountries.filter((el) => el.code3 === code)[0]?.states;
  selectState.innerHTML = `<option value="">Select State</option>`;
  if (states) {
    states.forEach((element) => {
      const option = document.createElement("option");
      option.textContent = element.name;
      option.value = element.code3;
      selectState.appendChild(option);
    });
  }
});

function checkValidators(validators) {
  let res = null;

  validators.forEach((validatorField) => {
    if (validatorField.validator[0].required) {
      if (
        document.getElementById(validatorField.field).value.length === 0 &&
        !res
      ) {
        res = {
          [validatorField.field]: {
            error: `${validatorField.field} is a required field`,
          },
        };
      }
    }
  });
  return res;
}

button.addEventListener("click", (e) => {
  e.preventDefault();
  const result = { message: {} };
  const response = checkValidators(validators);

  if (response) {
    result.message = response;
  } else if (name.value.trim().length < 4 || name.value.trim().length > 10) {
    result.message.Name = {
      error: "Length should be in between 4-10 characters.",
    };
    window.parent.postMessage(result, "*");
  } else if (contact.value.length > 0 && contact.value.length !== 10) {
    result.message.Contact = {
      error: "mobile number should be of 10 digits.",
    };
  } else if (email.value.length > 0 && !isValidEmail(email.value)) {
    result.message.Email = {
      error: "Not A Valid Email",
    };
  } else if (dob.value.length > 0 && !isDateLessThanToday(dob.value)) {
    result.message.Dob = {
      error: "Not A Valid Date of Birth",
    };
  } else {
    result.message.Success = "All Fields Are Valid";
  }

  setTimeout(() => {
    window.parent.postMessage(result, "*");
  }, 200);
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function isDateLessThanToday(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();
  return inputDate < today;
}
getAllCountries();
