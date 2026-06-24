export type PresetDisplayName =
    | "all"
    | "configuration"
    | "recommended"
    | "remarkOnly";
export function extractPresetDetailMatrixSection(
    presetName: PresetDisplayName,
    markdown: string
): string;
export function extractPresetsMatrixSection(markdown: string): string;
export function generatePresetDetailMatrixSectionFromRules(
    presetName: PresetDisplayName
): string;
export function generatePresetsRulesMatrixSectionFromRules(): string;
export function syncPresetsRulesMatrix(options?: {
    writeChanges?: boolean;
}): Promise<{ changed: boolean }>;
