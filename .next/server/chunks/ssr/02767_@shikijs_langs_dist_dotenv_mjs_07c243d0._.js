module.exports = {

"[project]/node_modules/.pnpm/@shikijs+langs@2.5.0/node_modules/@shikijs/langs/dist/dotenv.mjs [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const lang = Object.freeze(JSON.parse("{\"displayName\":\"dotEnv\",\"name\":\"dotenv\",\"patterns\":[{\"captures\":{\"1\":{\"patterns\":[{\"include\":\"#line-comment\"}]}},\"match\":\"^\\\\s?(#.*$)\\\\n\"},{\"captures\":{\"1\":{\"patterns\":[{\"include\":\"#key\"}]},\"2\":{\"name\":\"keyword.operator.assignment.dotenv\"},\"3\":{\"name\":\"property.value.dotenv\",\"patterns\":[{\"include\":\"#line-comment\"},{\"include\":\"#double-quoted-string\"},{\"include\":\"#single-quoted-string\"},{\"include\":\"#interpolation\"}]}},\"match\":\"^\\\\s?(.*?)\\\\s?(\\\\=)(.*)$\"}],\"repository\":{\"double-quoted-string\":{\"captures\":{\"1\":{\"patterns\":[{\"include\":\"#interpolation\"},{\"include\":\"#escape-characters\"}]}},\"match\":\"\\\"(.*)\\\"\",\"name\":\"string.quoted.double.dotenv\"},\"escape-characters\":{\"match\":\"\\\\\\\\[nrtfb\\\"'\\\\\\\\]|\\\\\\\\u[0123456789ABCDEF]{4}\",\"name\":\"constant.character.escape.dotenv\"},\"interpolation\":{\"captures\":{\"1\":{\"name\":\"keyword.interpolation.begin.dotenv\"},\"2\":{\"name\":\"variable.interpolation.dotenv\"},\"3\":{\"name\":\"keyword.interpolation.end.dotenv\"}},\"match\":\"(\\\\$\\\\{)(.*)(\\\\})\"},\"key\":{\"captures\":{\"1\":{\"name\":\"keyword.key.export.dotenv\"},\"2\":{\"name\":\"variable.key.dotenv\",\"patterns\":[{\"include\":\"#variable\"}]}},\"match\":\"(export\\\\s)?(.*)\"},\"line-comment\":{\"match\":\"#.*$\",\"name\":\"comment.line.dotenv\"},\"single-quoted-string\":{\"match\":\"'(.*)'\",\"name\":\"string.quoted.single.dotenv\"},\"variable\":{\"match\":\"[a-zA-Z_]+[a-zA-Z0-9_]*\"}},\"scopeName\":\"source.dotenv\"}"));
const __TURBOPACK__default__export__ = [
    lang
];
}}),

};

//# sourceMappingURL=02767_%40shikijs_langs_dist_dotenv_mjs_07c243d0._.js.map