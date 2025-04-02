module.exports = {

"[project]/node_modules/.pnpm/@shikijs+langs@2.5.0/node_modules/@shikijs/langs/dist/diff.mjs [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const lang = Object.freeze(JSON.parse("{\"displayName\":\"Diff\",\"name\":\"diff\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"punctuation.definition.separator.diff\"}},\"match\":\"^((\\\\*{15})|(={67})|(-{3}))$\\\\n?\",\"name\":\"meta.separator.diff\"},{\"match\":\"^\\\\d+(,\\\\d+)*(a|d|c)\\\\d+(,\\\\d+)*$\\\\n?\",\"name\":\"meta.diff.range.normal\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.range.diff\"},\"2\":{\"name\":\"meta.toc-list.line-number.diff\"},\"3\":{\"name\":\"punctuation.definition.range.diff\"}},\"match\":\"^(@@)\\\\s*(.+?)\\\\s*(@@)($\\\\n?)?\",\"name\":\"meta.diff.range.unified\"},{\"captures\":{\"3\":{\"name\":\"punctuation.definition.range.diff\"},\"4\":{\"name\":\"punctuation.definition.range.diff\"},\"6\":{\"name\":\"punctuation.definition.range.diff\"},\"7\":{\"name\":\"punctuation.definition.range.diff\"}},\"match\":\"^(((\\\\-{3}) .+ (\\\\-{4}))|((\\\\*{3}) .+ (\\\\*{4})))$\\\\n?\",\"name\":\"meta.diff.range.context\"},{\"match\":\"^diff --git a/.*$\\\\n?\",\"name\":\"meta.diff.header.git\"},{\"match\":\"^diff (-|\\\\S+\\\\s+\\\\S+).*$\\\\n?\",\"name\":\"meta.diff.header.command\"},{\"captures\":{\"4\":{\"name\":\"punctuation.definition.from-file.diff\"},\"6\":{\"name\":\"punctuation.definition.from-file.diff\"},\"7\":{\"name\":\"punctuation.definition.from-file.diff\"}},\"match\":\"(^(((-{3}) .+)|((\\\\*{3}) .+))$\\\\n?|^(={4}) .+(?= - ))\",\"name\":\"meta.diff.header.from-file\"},{\"captures\":{\"2\":{\"name\":\"punctuation.definition.to-file.diff\"},\"3\":{\"name\":\"punctuation.definition.to-file.diff\"},\"4\":{\"name\":\"punctuation.definition.to-file.diff\"}},\"match\":\"(^(\\\\+{3}) .+$\\\\n?| (-) .* (={4})$\\\\n?)\",\"name\":\"meta.diff.header.to-file\"},{\"captures\":{\"3\":{\"name\":\"punctuation.definition.inserted.diff\"},\"6\":{\"name\":\"punctuation.definition.inserted.diff\"}},\"match\":\"^(((>)( .*)?)|((\\\\+).*))$\\\\n?\",\"name\":\"markup.inserted.diff\"},{\"captures\":{\"1\":{\"name\":\"punctuation.definition.changed.diff\"}},\"match\":\"^(!).*$\\\\n?\",\"name\":\"markup.changed.diff\"},{\"captures\":{\"3\":{\"name\":\"punctuation.definition.deleted.diff\"},\"6\":{\"name\":\"punctuation.definition.deleted.diff\"}},\"match\":\"^(((<)( .*)?)|((-).*))$\\\\n?\",\"name\":\"markup.deleted.diff\"},{\"begin\":\"^(#)\",\"captures\":{\"1\":{\"name\":\"punctuation.definition.comment.diff\"}},\"end\":\"\\\\n\",\"name\":\"comment.line.number-sign.diff\"},{\"match\":\"^index [0-9a-f]{7,40}\\\\.\\\\.[0-9a-f]{7,40}.*$\\\\n?\",\"name\":\"meta.diff.index.git\"},{\"captures\":{\"1\":{\"name\":\"punctuation.separator.key-value.diff\"},\"2\":{\"name\":\"meta.toc-list.file-name.diff\"}},\"match\":\"^Index(:) (.+)$\\\\n?\",\"name\":\"meta.diff.index\"},{\"match\":\"^Only in .*: .*$\\\\n?\",\"name\":\"meta.diff.only-in\"}],\"scopeName\":\"source.diff\"}"));
const __TURBOPACK__default__export__ = [
    lang
];
}}),
"[project]/node_modules/.pnpm/@shikijs+langs@2.5.0/node_modules/@shikijs/langs/dist/git-commit.mjs [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$shikijs$2b$langs$40$2$2e$5$2e$0$2f$node_modules$2f40$shikijs$2f$langs$2f$dist$2f$diff$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@shikijs+langs@2.5.0/node_modules/@shikijs/langs/dist/diff.mjs [app-rsc] (ecmascript)");
;
const lang = Object.freeze(JSON.parse("{\"displayName\":\"Git Commit Message\",\"name\":\"git-commit\",\"patterns\":[{\"begin\":\"(?=^diff\\\\ \\\\-\\\\-git)\",\"contentName\":\"source.diff\",\"end\":\"\\\\z\",\"name\":\"meta.embedded.diff.git-commit\",\"patterns\":[{\"include\":\"source.diff\"}]},{\"begin\":\"^(?!#)\",\"end\":\"^(?=#)\",\"name\":\"meta.scope.message.git-commit\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"invalid.deprecated.line-too-long.git-commit\"},\"2\":{\"name\":\"invalid.illegal.line-too-long.git-commit\"}},\"match\":\"\\\\G.{0,50}(.{0,22}(.*))$\",\"name\":\"meta.scope.subject.git-commit\"}]},{\"begin\":\"^(?=#)\",\"contentName\":\"comment.line.number-sign.git-commit\",\"end\":\"^(?!#)\",\"name\":\"meta.scope.metadata.git-commit\",\"patterns\":[{\"captures\":{\"1\":{\"name\":\"markup.changed.git-commit\"}},\"match\":\"^#\\\\t((modified|renamed):.*)$\"},{\"captures\":{\"1\":{\"name\":\"markup.inserted.git-commit\"}},\"match\":\"^#\\\\t(new file:.*)$\"},{\"captures\":{\"1\":{\"name\":\"markup.deleted.git-commit\"}},\"match\":\"^#\\\\t(deleted.*)$\"},{\"captures\":{\"1\":{\"name\":\"keyword.other.file-type.git-commit\"},\"2\":{\"name\":\"string.unquoted.filename.git-commit\"}},\"match\":\"^#\\\\t([^:]+): *(.*)$\"}]}],\"scopeName\":\"text.git-commit\",\"embeddedLangs\":[\"diff\"]}"));
const __TURBOPACK__default__export__ = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$shikijs$2b$langs$40$2$2e$5$2e$0$2f$node_modules$2f40$shikijs$2f$langs$2f$dist$2f$diff$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"],
    lang
];
}}),

};

//# sourceMappingURL=02767_%40shikijs_langs_dist_471a60d4._.js.map