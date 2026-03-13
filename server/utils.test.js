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
            true,
            ""
        ]);
    })
})

def test_blacklist_username(self):
bad_user = "branler"
is_correct, message = validate_username(bad_user)
assert is_correct is False
assert f"'{bad_user}'" in message

def test_least_than_3_caracters(self):
bad_user = "lo"
is_correct, message = validate_username(bad_user)
assert is_correct is False
assert message == "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"

def test_higher_than_20_caracters(self):
bad_user = "lowestandhighestusername"
is_correct, message = validate_username(bad_user)
assert is_correct is False
assert message == "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"

def test_unauthorized_caracters(self):
bad_user = "unauthorized!"
is_correct, message = validate_username(bad_user)
assert is_correct is False
assert message == "The username need to be between 3 and 20 characters long and contain only letters, numbers, or underscore"

def test_correct_username(self):
correct_user = "Clément_88"
is_correct, message = validate_username(correct_user)
assert is_correct is True
assert message == "Perfect username"
