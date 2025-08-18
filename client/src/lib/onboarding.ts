import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const onboarding = driver({
  showProgress: true,
  steps: [
    {
      element: "#welcome-dialog",
      popover: {
        title: "Let's get started!",
        description: "Explore the app and see how it works!",
        onNextClick: () => {
          window.location.href = "/leads";
          setTimeout(() => {
            onboarding.moveNext();
          }, 1000);
        },
      },
    },
    {
      element: ".leads-stats-cards",
      popover: {
        title: "Leads Stats Cards",
        description:
          "Here you can see the total number of leads, new leads, in progress leads, and lost leads.",
      },
    },
    {
      element: ".leads-action-bar",
      popover: {
        title: "Leads Action Bar",
        description:
          "Here you can search for leads, filter by status, industry, and add a new lead.",
      },
    },
    {
      element: ".leads-table",
      popover: {
        title: "Leads Table",
        description: "Here you can see all the leads in the table.",
      },
    },
    {
      element: ".leads-table-expanded-content",
      popover: {
        title: "Leads Table Expanded Content",
        description:
          "Here you can see the notes for a lead. You can add a new note by clicking the 'Add Note' button, and edit or delete a note by clicking the edit or delete icons.",
      },
    },
    {
      element: ".leads-table-actions",
      popover: {
        title: "Leads Table Actions",
        description: "Here you can see the actions for a lead.",
      },
    },
  ],
});

export default onboarding;
