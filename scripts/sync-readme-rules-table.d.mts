export function extractReadmeRulesSection(markdown: string): string;
export function generateReadmeRulesSectionFromRules(
    rules: Readonly<
        Record<
            string,
            {
                meta?: {
                    docs?: {
                        url: string;
                        configs?: readonly string[] | string;
                    };
                    fixable?: string;
                };
            }
        >
    >
): string;
export function syncReadmeRulesTable(options?: {
    writeChanges?: boolean;
}): Promise<{ changed: boolean }>;
