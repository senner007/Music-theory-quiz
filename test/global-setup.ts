
import { vi } from 'vitest';
import "../src/arrayProto"

process.stdin.setMaxListeners(20);

// Mock the MathFloor method to remove randomness
vi.mock("../src/random_func", () => {
    return {
        math_floor: vi.fn(),
    };
});