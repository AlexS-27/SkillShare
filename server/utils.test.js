import { describe, expect, test } from 'vitest';
import { isPasswordStrong } from './utils.js';


describe('isPasswordStrong', () => {
    test('tooShort',() => {
        expect(isPasswordStrong('123Ab')).toEqual([
            false,
            "Password must be at least 8 characters long"
        ]);
    });

    test('atLeastOneUpperCase',() => {
        expect(isPasswordStrong('password')).toEqual([
            false,
            "Password must contain at least one uppercase letter"
        ]);
    });

    test('atLeastOneLowerCase',() => {
        expect(isPasswordStrong('PASSWORD')).toEqual([
            false,
            "Password must contain at least one lowercase letter"
        ]);
    });

    test('atLeastOneDigit', () => {
        expect(isPasswordStrong('Password')).toEqual([
            false,
            "Password must contain at least one number"
        ]);
    });

    test('atLeastOneSpecialCharacter',() => {
        expect(isPasswordStrong('Password8')).toEqual([
            false,
            "Password must contain at least one special character"
        ]);
    });

    test('goodPassword',() => {
        expect(isPasswordStrong('Pa$$w0rd8')).toEqual([
            true,
            "Password is valid"
        ]);
    });
})
