
import { vi } from 'vitest';
import "../src/arrayProto"

// Mock the MathFloor method to remove randomness
vi.mock("../src/random-funcs", () => {
    return {
        MathFloor: vi.fn(),
    };
});