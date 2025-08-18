import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const onboarding = driver({
  showProgress: true,
  steps: [
    {
      popover: {
        title: "Welcome to Eleads! 🎉🎉🎉",
        description:
          "This app is in progress, so some features may not work as expected. Once we are done, we will send you an email",
      },
    },
    {
      popover: {
        title: "Explore the app",
        description: "Feel free to explore the app and see how it works!",
      },
    },
  ],
});

export default onboarding;
