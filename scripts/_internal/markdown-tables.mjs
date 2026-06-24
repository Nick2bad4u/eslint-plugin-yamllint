/**
 * Normalize Markdown table spacing for generated docs comparisons.
 */

/** @param {string} value */
export const normalizeLineEndings = (value) => value.replaceAll("\r\n", "\n");

/** @param {string} markdown */
export const normalizeMarkdownTableSpacing = (markdown) =>
    normalizeLineEndings(markdown)
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trimEnd();
            const isTableRow = /^\|.*\|$/v.test(trimmedLine);

            if (!isTableRow) {
                return trimmedLine;
            }

            const cells = trimmedLine
                .split("|")
                .slice(1, -1)
                .map((cell) => {
                    const trimmedCell = cell.trim();
                    const isSeparatorCell = /^:?-+:?$/v.test(trimmedCell);
                    const hasStartColon = trimmedCell.startsWith(":");
                    const hasEndColon = trimmedCell.endsWith(":");

                    if (!isSeparatorCell) {
                        return trimmedCell;
                    }

                    if (hasStartColon && hasEndColon) {
                        return ":-:";
                    }

                    if (hasStartColon) {
                        return ":--";
                    }

                    if (hasEndColon) {
                        return "--:";
                    }

                    return "---";
                });

            return `| ${cells.join(" | ")} |`;
        })
        .join("\n")
        .trim();
