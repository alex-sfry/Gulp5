module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "jquery": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "prefer-const": "warn",
        "max-len": ["warn", { "code": 120, "ignoreUrls": true }],
        "semi": "warn"
    }
};
