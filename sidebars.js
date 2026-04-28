"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sidebars = {
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
    ],
};
exports.default = sidebars;
