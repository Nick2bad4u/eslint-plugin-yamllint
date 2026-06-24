/* eslint-disable vitest/no-hooks, vitest/require-top-level-describe -- Vitest setup files register process cleanup outside test describes. */
import { afterAll } from "vitest";

afterAll(() => undefined);
/* eslint-enable vitest/no-hooks, vitest/require-top-level-describe -- Re-enable after Vitest setup hook registration. */
