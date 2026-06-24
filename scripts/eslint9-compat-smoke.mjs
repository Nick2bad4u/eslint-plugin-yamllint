import { ESLint } from "eslint";
import pc from "picocolors";

/** @typedef {import("eslint").Linter.Config} FlatConfig */
/** @typedef {Record<string, FlatConfig | readonly FlatConfig[]>} PluginConfigs */

const positiveIntegerPattern = /^(?:[1-9]\d*)$/u;

/** @param {string} value */
const parsePositiveInteger = (value) => {
    if (!positiveIntegerPattern.test(value)) {
        return undefined;
    }

    const parsedValue = Number.parseInt(value, 10);

    return Number.isSafeInteger(parsedValue) && parsedValue > 0
        ? parsedValue
        : undefined;
};

/**
 * @param {readonly string[]} argv
 *
 * @throws {TypeError} When the expected ESLint major flag is not a positive
 *   integer.
 */
const getExpectedEslintMajor = (argv) => {
    const expectedFlag = argv.find((argument) =>
        argument.startsWith("--expect-eslint-major=")
    );

    if (expectedFlag === undefined) {
        return undefined;
    }

    const rawMajor = expectedFlag.slice("--expect-eslint-major=".length);
    const parsedMajor = parsePositiveInteger(rawMajor);

    if (parsedMajor === undefined) {
        throw new TypeError(
            `Invalid --expect-eslint-major value: ${rawMajor}. Expected a positive integer major version.`
        );
    }

    return parsedMajor;
};

/**
 * @param {string} version
 *
 * @throws {TypeError} When the ESLint version string does not start with a
 *   positive integer.
 */
const getEslintMajorVersion = (version) => {
    const [majorText = "0"] = version.split(".");
    const parsedMajor = parsePositiveInteger(majorText);

    if (parsedMajor === undefined) {
        throw new TypeError(
            `Unable to determine ESLint major version from: ${version}`
        );
    }

    return parsedMajor;
};

/**
 * @param {PluginConfigs} pluginConfigs
 * @param {string} configName
 * @param {readonly string[]} [fallbackConfigNames]
 *
 * @throws {TypeError} When the requested plugin config is missing or is not a
 *   single flat config.
 */
const getSingleFlatConfig = (
    pluginConfigs,
    configName,
    fallbackConfigNames = []
) => {
    const candidateConfigNames = [configName, ...fallbackConfigNames];

    for (const candidateName of candidateConfigNames) {
        const configValue = pluginConfigs[candidateName];

        if (configValue === undefined) {
            continue;
        }

        if (Array.isArray(configValue)) {
            throw new TypeError(
                `Expected plugin.configs.${candidateName} to be a single flat config object.`
            );
        }

        return /** @type {FlatConfig} */ (configValue);
    }

    throw new TypeError(
        `Could not find plugin config ${configName} (checked fallbacks: ${fallbackConfigNames.join(", ") || "none"}).`
    );
};

/** @returns {Promise<PluginConfigs>} */
const loadPluginConfigs = async () => {
    const pluginModule = await import("../plugin.mjs");
    const pluginValue = pluginModule.default;

    return /** @type {PluginConfigs} */ (pluginValue.configs ?? {});
};

const run = async () => {
    const expectedEslintMajor = getExpectedEslintMajor(process.argv.slice(2));
    const installedEslintMajor = getEslintMajorVersion(ESLint.version);

    if (
        expectedEslintMajor !== undefined &&
        installedEslintMajor !== expectedEslintMajor
    ) {
        throw new Error(
            `Expected ESLint major ${expectedEslintMajor} but found ${ESLint.version}.`
        );
    }

    const pluginConfigs = await loadPluginConfigs();
    const markdownConfig = getSingleFlatConfig(pluginConfigs, "remarkOnly", [
        "markdown",
    ]);

    const markdownEslint = new ESLint({
        cwd: process.cwd(),
        fix: true,
        overrideConfig: {
            ...markdownConfig,
            rules: {
                ...markdownConfig.rules,
                "remark/remark": [
                    "error",
                    { configFile: "test/fixtures/remark/alt-text.config.mjs" },
                ],
            },
        },
        overrideConfigFile: true,
    });
    const [markdownResult] = await markdownEslint.lintText("![](image.png)\n", {
        filePath: "compat.md",
    });

    if ((markdownResult?.messages.length ?? 0) === 0) {
        throw new Error(
            "Remark compatibility smoke test produced no diagnostic output."
        );
    }

    const configEslint = new ESLint({
        cwd: process.cwd(),
        fix: true,
        overrideConfig: getSingleFlatConfig(pluginConfigs, "configuration", [
            "configs",
        ]),
        overrideConfigFile: true,
    });
    const [configResult] = await configEslint.lintText(
        'export default { plugins: "remark-gfm" };',
        { filePath: "remark.config.mjs" }
    );

    if (configResult?.output?.includes('plugins: ["remark-gfm"]') !== true) {
        throw new Error(
            "Config compatibility smoke test did not apply plugins-array autofix."
        );
    }

    console.log(
        `${pc.green("✓")} ESLint 9/10 compatibility smoke checks passed.`
    );
};

await run();
