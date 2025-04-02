module.exports = {

"[project]/node_modules/.pnpm/@shikijs+langs@2.5.0/node_modules/@shikijs/langs/dist/json5.mjs [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const lang = Object.freeze(JSON.parse("{\"displayName\":\"JSON5\",\"fileTypes\":[\"json5\"],\"name\":\"json5\",\"patterns\":[{\"include\":\"#comments\"},{\"include\":\"#value\"}],\"repository\":{\"array\":{\"begin\":\"\\\\[\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.array.begin.json5\"}},\"end\":\"\\\\]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.array.end.json5\"}},\"name\":\"meta.structure.array.json5\",\"patterns\":[{\"include\":\"#comments\"},{\"include\":\"#value\"},{\"match\":\",\",\"name\":\"punctuation.separator.array.json5\"},{\"match\":\"[^\\\\s\\\\]]\",\"name\":\"invalid.illegal.expected-array-separator.json5\"}]},\"comments\":{\"patterns\":[{\"match\":\"/{2}.*\",\"name\":\"comment.single.json5\"},{\"begin\":\"/\\\\*\\\\*(?!/)\",\"captures\":{\"0\":{\"name\":\"punctuation.definition.comment.json5\"}},\"end\":\"\\\\*/\",\"name\":\"comment.block.documentation.json5\"},{\"begin\":\"/\\\\*\",\"captures\":{\"0\":{\"name\":\"punctuation.definition.comment.json5\"}},\"end\":\"\\\\*/\",\"name\":\"comment.block.json5\"}]},\"constant\":{\"match\":\"\\\\b(?:true|false|null|Infinity|NaN)\\\\b\",\"name\":\"constant.language.json5\"},\"infinity\":{\"match\":\"(-)*\\\\b(?:Infinity|NaN)\\\\b\",\"name\":\"constant.language.json5\"},\"key\":{\"name\":\"string.key.json5\",\"patterns\":[{\"include\":\"#stringSingle\"},{\"include\":\"#stringDouble\"},{\"match\":\"[a-zA-Z0-9_-]\",\"name\":\"string.key.json5\"}]},\"number\":{\"patterns\":[{\"match\":\"(0x)[0-9a-fA-f]*\",\"name\":\"constant.hex.numeric.json5\"},{\"match\":\"[+-.]?(?=[1-9]|0(?!\\\\d))\\\\d+(\\\\.\\\\d+)?([eE][+-]?\\\\d+)?\",\"name\":\"constant.dec.numeric.json5\"}]},\"object\":{\"begin\":\"\\\\{\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.dictionary.begin.json5\"}},\"end\":\"\\\\}\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.dictionary.end.json5\"}},\"name\":\"meta.structure.dictionary.json5\",\"patterns\":[{\"include\":\"#comments\"},{\"include\":\"#key\"},{\"begin\":\":\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.separator.dictionary.key-value.json5\"}},\"end\":\"(,)|(?=\\\\})\",\"endCaptures\":{\"1\":{\"name\":\"punctuation.separator.dictionary.pair.json5\"}},\"name\":\"meta.structure.dictionary.value.json5\",\"patterns\":[{\"include\":\"#value\"},{\"match\":\"[^\\\\s,]\",\"name\":\"invalid.illegal.expected-dictionary-separator.json5\"}]},{\"match\":\"[^\\\\s\\\\}]\",\"name\":\"invalid.illegal.expected-dictionary-separator.json5\"}]},\"stringDouble\":{\"begin\":\"[\\\"]\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.json5\"}},\"end\":\"[\\\"]\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.json5\"}},\"name\":\"string.quoted.json5\",\"patterns\":[{\"match\":\"(?:\\\\\\\\(?:[\\\"\\\\\\\\/bfnrt]|u[0-9a-fA-F]{4}))\",\"name\":\"constant.character.escape.json5\"},{\"match\":\"\\\\\\\\.\",\"name\":\"invalid.illegal.unrecognized-string-escape.json5\"}]},\"stringSingle\":{\"begin\":\"[']\",\"beginCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.begin.json5\"}},\"end\":\"[']\",\"endCaptures\":{\"0\":{\"name\":\"punctuation.definition.string.end.json5\"}},\"name\":\"string.quoted.json5\",\"patterns\":[{\"match\":\"(?:\\\\\\\\(?:[\\\"\\\\\\\\/bfnrt]|u[0-9a-fA-F]{4}))\",\"name\":\"constant.character.escape.json5\"},{\"match\":\"\\\\\\\\.\",\"name\":\"invalid.illegal.unrecognized-string-escape.json5\"}]},\"value\":{\"patterns\":[{\"include\":\"#constant\"},{\"include\":\"#infinity\"},{\"include\":\"#number\"},{\"include\":\"#stringSingle\"},{\"include\":\"#stringDouble\"},{\"include\":\"#array\"},{\"include\":\"#object\"}]}},\"scopeName\":\"source.json5\"}"));
const __TURBOPACK__default__export__ = [
    lang
];
}}),

};

//# sourceMappingURL=02767_%40shikijs_langs_dist_json5_mjs_9838ca15._.js.map