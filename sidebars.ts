import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: "category",
      label: "Getting Started",
      items: ["intro", "getting-started/quickstart", "getting-started/concepts"],
      collapsed: false,
    },
    {
      type: "category",
      label: "Features",
      items: [
        "features/beats-scenes-shots",
        "features/ai-pipeline",
        "features/cinematography",
        "features/actors-characters",
        "features/video-editor",
        "features/integrations",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        "tutorials/first-video",
        "tutorials/script-to-shots",
        "tutorials/custom-actors",
      ],
    },
    {
      type: "category",
      label: "Reference",
      items: ["roadmap", "changelog"],
    },
    {
      type: "category",
      label: "Customer Service",
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "customer_service/overview",
          label: "Contact Customer Service",
        },
      ],
    },
    {
      type: "category",
      label: "Legal",
      collapsed: false,
      items: [
        { type: "doc", id: "legal/intro", label: "Intro" },
        "legal/terms-of-service",
        "legal/privacy-policy",
        "ownership_of_output/overview",
        "training/overview",
      ],
    },
  ],
};

export default sidebars;
