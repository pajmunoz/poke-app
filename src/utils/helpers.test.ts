import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateCurrentPage, calculateTotalPages, capitalizeFirst, debounce, ensureMin, formatAbilities, formatHeight, formatNumber, formatPokemonName, formatTypes, formatWeight, generateId, getArrayLength, getNestedProperty, hasItems, isArray, isEmpty, throttle, toNumber } from './helpers';

describe('capitalizeFirst', () => {
    it('should capitalize the first letter of the string', () => {
        expect(capitalizeFirst('hello')).toBe('Hello');
        expect(capitalizeFirst('')).toBe('');
        expect(capitalizeFirst('123')).toBe('123');
        expect(capitalizeFirst('')).toBe('');
        expect(capitalizeFirst('123')).toBe('123');
        expect(capitalizeFirst('')).toBe('');
    });
});
describe('isArray', () => {
    it('should return true if the value is an array', () => {
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray([])).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isArray('')).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(undefined)).toBe(false);
    });
});
describe('hasItems', () => {
    it('should return true if the array has items', () => {
        expect(hasItems([1, 2, 3])).toBe(true);
        expect(hasItems([])).toBe(false);
    });
});
describe('getArrayLength', () => {
    it('should return the length of the array', () => {
        expect(getArrayLength([1, 2, 3])).toBe(3);
        expect(getArrayLength([])).toBe(0);
    });
});
describe('formatPokemonName', () => {
    it('should return the formatted pokemon name', () => {
        expect(formatPokemonName('pikachu')).toBe('Pikachu');
    });
});
describe('ensureMin', () => {
    it('should return the value if it is greater than the min', () => {
        expect(ensureMin(10, 5)).toBe(10);
        expect(ensureMin(5, 10)).toBe(10);
    });
});
describe('calculateCurrentPage', () => {
    it('should return the current page', () => {
        expect(calculateCurrentPage(0, 10)).toBe(1);   // First page: offset 0, limit 10
        expect(calculateCurrentPage(10, 10)).toBe(2);  // Second page: offset 10, limit 10
        expect(calculateCurrentPage(20, 10)).toBe(3);  // Third page: offset 20, limit 10
    });
});
describe('calculateTotalPages', () => {
    it('should return the total number of pages', () => {
        expect(calculateTotalPages(10, 10)).toBe(1);
        expect(calculateTotalPages(10, 5)).toBe(2);
    });
});
describe('formatHeight', () => {
    it('should return the formatted height', () => {
        expect(formatHeight(10)).toBe('1.0m');
        expect(formatHeight(0)).toBe('Unknown');
    });
});
describe('formatWeight', () => {
    it('should return the formatted weight', () => {
        expect(formatWeight(10)).toBe('1.0kg');
        expect(formatWeight(0)).toBe('Unknown');
    });
});
describe('formatAbilities', () => {
    it('should return the formatted abilities', () => {
        expect(formatAbilities(['overgrow', 'chlorophyll'])).toBe('Overgrow, Chlorophyll');
        expect(formatAbilities([])).toBe('Unknown');
    });
});
describe('formatTypes', () => {
    it('should return the formatted types', () => {
        expect(formatTypes(['normal', 'fire'])).toBe('Normal, Fire');
        expect(formatTypes([])).toBe('Unknown');
    });
});
describe('getNestedProperty', () => {
    it('should return the nested property', () => {
        expect(getNestedProperty({ a: { b: { c: 1 } } }, 'a.b.c', 0)).toBe(1);
        expect(getNestedProperty({ a: { b: { c: 1 } } }, 'a.b.d', 0)).toBe(0);
    });
});
describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should delay function execution', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced();
        expect(func).not.toHaveBeenCalled();
        
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('should only execute once when called multiple times', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced();
        debounced();
        debounced();
        
        expect(func).not.toHaveBeenCalled();
        
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });
});

describe('throttle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should execute function immediately on first call', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);
        
        throttled();
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('should limit execution frequency', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);
        
        throttled(); // First call - should execute
        expect(func).toHaveBeenCalledTimes(1);
        
        throttled(); // Second call within throttle period - should not execute
        expect(func).toHaveBeenCalledTimes(1);
        
        vi.advanceTimersByTime(100);
        throttled(); // Should execute after throttle period
        expect(func).toHaveBeenCalledTimes(2);
    });
});
describe('generateId', () => {
    it('should return a unique id', () => {
        expect(generateId()).toBeDefined();
    });
});
describe('isEmpty', () => {
    it('should return true if the value is empty', () => {
        expect(isEmpty('')).toBe(true);
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
    });
});
describe('toNumber', () => {
    it('should return the number', () => {
        expect(toNumber('123')).toBe(123);
        expect(toNumber('123.45')).toBe(123.45);
        expect(toNumber('123.45')).toBe(123.45);
    });
});
describe('formatNumber', () => {
    it('should return the formatted number', () => {
        expect(formatNumber(123)).toBe('123');
        expect(formatNumber(1234567890)).toBe('1,234,567,890');
    });
});