/**
 * Utility functions for the Pokemon application
 */

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 */
export const capitalizeFirst = (str: string): string => {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Safely checks if a value is an array
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 */
export const isArray = (value: any): value is any[] => {
    return Array.isArray(value);
};

/**
 * Checks if an array has items
 * @param arr - The array to check
 * @returns True if the array has items, false otherwise
 */
export const hasItems = (arr: any[]): boolean => {
    return isArray(arr) && arr.length > 0;
};

/**
 * Safely gets the length of an array
 * @param arr - The array to get length from
 * @returns The length of the array, or 0 if not an array
 */
export const getArrayLength = (arr: any[]): number => {
    return isArray(arr) ? arr.length : 0;
};

/**
 * Calculates the current page number based on offset and limit
 * @param offset - Current offset
 * @param limit - Items per page
 * @returns Current page number (1-based)
 */
export const calculateCurrentPage = (offset: number, limit: number): number => {
    return Math.floor(offset / limit) + 1;
};

/**
 * Calculates the total number of pages based on total items and limit
 * @param total - Total number of items
 * @param limit - Items per page
 * @returns Total number of pages
 */
export const calculateTotalPages = (total: number, limit: number): number => {
    return Math.ceil(total / limit);
};

/**
 * Ensures a number is not below a minimum value
 * @param value - The number to check
 * @param min - Minimum allowed value
 * @returns The value if above min, otherwise min
 */
export const ensureMin = (value: number, min: number): number => {
    return Math.max(value, min);
};

/**
 * Formats a Pokemon name for display (capitalizes first letter)
 * @param name - The Pokemon name
 * @returns Formatted name
 */
export const formatPokemonName = (name: string): string => {
    return capitalizeFirst(name);
};

/**
 * Formats height for display
 * @param height - Height in decimeters
 * @returns Formatted height string
 */
export const formatHeight = (height: number): string => {
    if (!height || height <= 0) return 'Unknown';
    return `${(height / 10).toFixed(1)}m`;
};

/**
 * Formats weight for display
 * @param weight - Weight in hectograms
 * @returns Formatted weight string
 */
export const formatWeight = (weight: number): string => {
    if (!weight || weight <= 0) return 'Unknown';
    return `${(weight / 10).toFixed(1)}kg`;
};

/**
 * Formats Pokemon types for display
 * @param types - Array of type names
 * @returns Formatted types string
 */
export const formatTypes = (types: string[]): string => {
    if (!hasItems(types)) return 'Unknown';
    return types.map(type => capitalizeFirst(type)).join(', ');
};

/**
 * Formats Pokemon abilities for display
 * @param abilities - Array of ability names
 * @returns Formatted abilities string
 */
export const formatAbilities = (abilities: string[]): string => {
    if (!hasItems(abilities)) return 'Unknown';
    return abilities.map(ability => capitalizeFirst(ability)).join(', ');
};

/**
 * Safely gets a nested property from an object
 * @param obj - The object to search in
 * @param path - The path to the property (e.g., 'user.profile.name')
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default value
 */
export const getNestedProperty = <T>(
    obj: any, 
    path: string, 
    defaultValue: T
): T => {
    try {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return defaultValue;
            }
        }
        
        return result !== undefined ? result : defaultValue;
    } catch {
        return defaultValue;
    }
};

/**
 * Debounces a function call
 * @param func - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Throttles a function call
 * @param func - The function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Generates a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array)
 * @param value - The value to check
 * @returns True if the value is empty, false otherwise
 */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Safely converts a value to a number
 * @param value - The value to convert
 * @param defaultValue - Default value if conversion fails
 * @returns The converted number or default value
 */
export const toNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
};

/**
 * Formats a number with commas for thousands
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
    return num.toLocaleString();
};
