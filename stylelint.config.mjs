import sharedConfig from "stylelint-config-nick2bad4u";

/** @type {import("stylelint").Config} */
const config = {
    ...sharedConfig,
    rules: {
        ...sharedConfig.rules,
    },
};

export default config;
