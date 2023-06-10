
import { vi } from 'vitest';
import "../src/arrayProto"

// Mock the MathFloor method to remove randomness
vi.mock("../src/random_func", () => {
    return {
        math_floor: vi.fn(),
    };
});