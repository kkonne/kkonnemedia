const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const HEADER_MENU = document.querySelector("header");
const IMAGE_SLIDER = document.getElementById("image-slider");
const CONTACT_FORM = document.getElementById("contact-form");
const REGEX_PATTERNS = {
  email:
    /^[A-Za-z0-9]+((_|-|\+|\.)[A-Za-z0-9]+)*?@[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z]{2,16})?(\.[A-Za-z]{2,6})$/,
};
let IS_MESSAGE_SENT = false;

const setMenuItemEffect = (item, index) => {
  item.onmouseover = (event) => {
    HEADER_MENU.dataset.activeIndex = index;
    addFlickerHoverEffect(event);
  };
  item.ontouchstart = (event) => {
    HEADER_MENU.dataset.activeIndex = index;
    addFlickerHoverEffect(event.touches[0]);
  };
};

const addFlickerHoverEffect = (event) => {
  let iterations = 0;
  const interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((_, index) => {
        if (index < iterations) return event.target.dataset.value[index];

        return LETTERS[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iterations >= event.target.dataset.value.length)
      clearInterval(interval);

    iterations += 1 / 3;
  }, 35);
};

const handleMouseDown = (event) => {
  IMAGE_SLIDER.dataset.mouseDownAt = event.clientX;
};

const handleMouseMove = (event) => {
  if (IMAGE_SLIDER.dataset.mouseDownAt === "0") return;

  const mouseDelta =
      parseFloat(IMAGE_SLIDER.dataset.mouseDownAt) - event.clientX,
    maxDelta = window.innerWidth / 1.5;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnhandled =
      parseFloat(IMAGE_SLIDER.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnhandled, 0), -90);

  IMAGE_SLIDER.dataset.percentage = nextPercentage;

  IMAGE_SLIDER.animate(
    {
      translate: `${nextPercentage}% 0%`,
    },
    {
      duration: 1200,
      fill: "forwards",
    }
  );

  IMAGE_SLIDER.querySelectorAll("img").forEach((image) => {
    image.animate(
      {
        objectPosition: `${nextPercentage + 100}% center`,
      },
      {
        duration: 1200,
        fill: "forwards",
      }
    );
  });
};

const handleMouseUp = () => {
  IMAGE_SLIDER.dataset.mouseDownAt = "0";
  IMAGE_SLIDER.dataset.prevPercentage = IMAGE_SLIDER.dataset.percentage;
};

const isFormValid = (form) => {
  if (IS_MESSAGE_SENT) {
    setMessage("error", "Spam detected. Please try again later.");
    return false;
  }

  const { user_name, user_email, subject, message } = form;

  if (
    !user_name.value ||
    !user_email.value ||
    !subject.value ||
    !message.value
  ) {
    setMessage("error", "Please fill out all fields.");
    return false;
  }

  if (!REGEX_PATTERNS.email.test(user_email.value)) {
    setMessage("error", "Email format is wrong. Please check email input.");
    return false;
  }

  return true;
};

const setMessage = (type, message) => {
  const messageTypeId = `alert-${type}`;
  const counterMessageTypeId =
    type !== "error" ? "alert-error" : "alert-success";
  const messageDurationInSeconds = 7;
  document.getElementById(counterMessageTypeId).style.display = "none";
  document.getElementById(messageTypeId).textContent = message;
  document.getElementById(messageTypeId).style.display = "block";
  setTimeout(() => {
    document.getElementById(messageTypeId).style.display = "none";
  }, 1000 * messageDurationInSeconds);
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  if (!isFormValid(event.target)) return;

  emailjs.sendForm("service_002u6cn", "template_all6mjd", CONTACT_FORM).then(
    () => {
      setMessage("success", "Success! Email has been sent.");
      event.target.reset();
      const SPAM_TIMEOUT_IN_SECONDS = 60;
      IS_MESSAGE_SENT = true;
      setTimeout(() => {
        IS_MESSAGE_SENT = false;
      }, 1000 * SPAM_TIMEOUT_IN_SECONDS);
    },
    (error) => {
      setMessage("error", "An error ocurred. Please try again later.");
    }
  );
};

const onInit = () => {
  document.querySelectorAll("nav > a").forEach(setMenuItemEffect);

  CONTACT_FORM.addEventListener("submit", handleFormSubmit);
};

onInit();
