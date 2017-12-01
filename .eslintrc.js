module.exports = {
    "parserOptions": {
        "ecmaVersion": 6
    },
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": ["error", { allow: ["warn", "error"] } ],
        "indent": [ "error", 4 ],
        "linebreak-style": [ "error", "windows" ],
        "semi": [ "error", "always" ],
        "eol-last": [ "error", "always" ],
    }
};