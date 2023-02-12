const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const HEADER_MENU = document.querySelector("header");
const IMAGE_SLIDER = document.getElementById("image-slider");

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

const onInit = () => {
  document.querySelectorAll("nav > a").forEach(setMenuItemEffect);

  // window.onmousedown = (event) => handleMouseDown(event);
  // window.ontouchstart = (event) => handleMouseDown(event.touches[0]);
  // window.onmousemove = (event) => handleMouseMove(event);
  // window.ontouchmove = (event) => handleMouseMove(event.touches[0]);
  // window.onmouseup = () => handleMouseUp();
  // window.ontouchend = () => handleMouseUp();
};

onInit();
