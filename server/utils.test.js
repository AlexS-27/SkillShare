import { describe, expect, test } from 'vitest';
import { isPasswordStrong, isPseudoCorrect } from './utils.js';


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

describe('isUsernameValid', () => {
    test('blacklistUsername',() => {
        const bad_user = 'branler'
        expect(isPseudoCorrect(bad_user)).toEqual([
            false,
            `The word '${bad_user}' isn't allowed in the username`
        ]);
    })

    test('PseudoTooShort',() => {
        expect(isPseudoCorrect("ak")).toEqual([
            false,
            "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"
        ]);
    })

    test('PseudoTooLong',() => {
        expect(isPseudoCorrect('lowestandhighestusername')).toEqual([
            false,
            "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"
        ]);
    })

    test('UnauthorizedUsername',() => {
        expect(isPseudoCorrect('unauthorized!')).toEqual([
            false,
            "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"
        ]);
    })

    test('correctUsername',() => {
        expect(isPseudoCorrect('password')).toEqual([
            true,
            "Username valid"
        ]);
    })
})

