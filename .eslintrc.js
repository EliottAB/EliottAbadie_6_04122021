module.exports = {
    env: {
        "node": true,
        "browser": true,
        "es6": true
    },
    extends: "eslint:recommended",
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    parserOptions: {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    rules: {
        //ces deux rules ci dessous ont été retirées car elles signalaient des erreurs de liens entre les fichiers js. Les erreurs justifiées ont été fixées.
        "no-unused-vars": "off",
        "no-undef": "off",
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
}