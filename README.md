repro for https://github.com/oxc-project/oxc-zed/issues/160

```
Zed 0.231.1
e71b6aa44ffaac9bdaf986288289359e6f1b3572
0.231.1+stable.213.e71b6aa44ffaac9bdaf986288289359e6f1b3572

Oxc Zed 0.4.6
```

---

no errors reported in editor

> [!NOTE]
> there was a moment while testing where the expected error _was_ reported in editor: reloaded workspace and zed did a download of oxc-zed (without a resulting version change), after which error was shown. on reloading lsp servers, and trying to reload workspace again, the expected error went back to not being shown consistently. unfortuantely lsp logs were not collected in that instance.

running oxlint cli via `npm run lint` (or `npx oxlint`) reports errors as expected

```zsh
❯ npm run lint

> zed-oxc-repro@0.0.0 lint
> oxlint


  × typescript-eslint(no-unsafe-type-assertion): Unsafe type assertion: type 'number' is more narrow than the original type.
   ╭─[mod.ts:1:13]
 1 │ const foo = {} as number;
   ·             ────────────
 2 │
   ╰────

Found 0 warnings and 1 error.
Finished in 74ms on 3 files with 141 rules using 14 threads.
```

oxlint lsp rpc logs when editing `mod.ts`

```jsonc
// Send:
{"jsonrpc":"2.0","id":7,"method":"textDocument/codeAction","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"range":{"start":{"line":0,"character":25},"end":{"line":0,"character":25}},"context":{"diagnostics":[]}}}

// Receive:
{"jsonrpc":"2.0","result":null,"id":7}

// Send:
{"jsonrpc":"2.0","method":"textDocument/didChange","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts","version":1},"contentChanges":[{"text":"const foo = {} as number\n\nexport { foo };\n"}]}}

// Send:
{"jsonrpc":"2.0","id":8,"method":"textDocument/diagnostic","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"identifier":null,"previousResultId":null}}

// Receive:
{"jsonrpc":"2.0","result":{"kind":"full","items":[{"range":{"start":{"line":0,"character":12},"end":{"line":0,"character":24}},"severity":1,"code":"typescript-eslint(no-unsafe-type-assertion)","codeDescription":{"href":"https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-type-assertion.html"},"source":"oxc","message":"Unsafe type assertion: type 'number' is more narrow than the original type.","relatedInformation":[{"location":{"uri":"file:///path/to/zed-oxc-repro/mod.ts","range":{"start":{"line":0,"character":12},"end":{"line":0,"character":24}}},"message":""}]}]},"id":8}

// Send:
{"jsonrpc":"2.0","id":9,"method":"textDocument/codeAction","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"range":{"start":{"line":0,"character":24},"end":{"line":0,"character":24}},"context":{"diagnostics":[]}}}

// Receive:
{"jsonrpc":"2.0","result":[{"title":"Disable typescript/no-unsafe-type-assertion for this line","kind":"quickfix","edit":{"changes":{"file:///path/to/zed-oxc-repro/mod.ts":[{"range":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}},"newText":"// oxlint-disable-next-line typescript/no-unsafe-type-assertion\n"}]}},"isPreferred":false},{"title":"Disable typescript/no-unsafe-type-assertion for this whole file","kind":"quickfix","edit":{"changes":{"file:///path/to/zed-oxc-repro/mod.ts":[{"range":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}},"newText":"// oxlint-disable typescript/no-unsafe-type-assertion\n"}]}},"isPreferred":false}],"id":9}

// Send:
{"jsonrpc":"2.0","method":"textDocument/didChange","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts","version":2},"contentChanges":[{"text":"const foo = {} as number;\n\nexport { foo };\n"}]}}

// Send:
{"jsonrpc":"2.0","id":10,"method":"textDocument/diagnostic","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"identifier":null,"previousResultId":null}}

// Receive:
{"jsonrpc":"2.0","result":{"kind":"full","items":[{"range":{"start":{"line":0,"character":12},"end":{"line":0,"character":24}},"severity":1,"code":"typescript-eslint(no-unsafe-type-assertion)","codeDescription":{"href":"https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-type-assertion.html"},"source":"oxc","message":"Unsafe type assertion: type 'number' is more narrow than the original type.","relatedInformation":[{"location":{"uri":"file:///path/to/zed-oxc-repro/mod.ts","range":{"start":{"line":0,"character":12},"end":{"line":0,"character":24}}},"message":""}]}]},"id":10}

// Send:
{"jsonrpc":"2.0","id":11,"method":"textDocument/codeAction","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"range":{"start":{"line":0,"character":25},"end":{"line":0,"character":25}},"context":{"diagnostics":[]}}}

// Receive:
{"jsonrpc":"2.0","result":null,"id":11}

// Send:
{"jsonrpc":"2.0","id":12,"method":"textDocument/codeAction","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"range":{"start":{"line":0,"character":0},"end":{"line":3,"character":0}},"context":{"diagnostics":[],"only":["source.fixAll.oxc"]}}}

// Receive:
{"jsonrpc":"2.0","result":null,"id":12}

// Send:
{"jsonrpc":"2.0","method":"textDocument/didSave","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"}}}
```

tsgo lsp rpc logs when editing `mod.ts`

```jsonc
// Send:
{"jsonrpc":"2.0","method":"textDocument/didChange","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts","version":1},"contentChanges":[{"range":{"start":{"line":0,"character":24},"end":{"line":0,"character":25}},"text":""}]}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/didChange' in 8.042µs"}}

// Send:
{"jsonrpc":"2.0","id":12,"method":"textDocument/linkedEditingRange","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"position":{"line":0,"character":24}}}

// Send:
{"jsonrpc":"2.0","id":13,"method":"textDocument/diagnostic","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"identifier":null,"previousResultId":null}}

// Receive:
{"jsonrpc":"2.0","id":13,"error":{"code":-32602,"message":"InvalidParams: json: cannot unmarshal JSON object into Go lsproto.Message: InvalidParams: failed to unmarshal *lsproto.DocumentDiagnosticParams: json: cannot unmarshal into Go lsproto.DocumentDiagnosticParams within \"/identifier\": null value is not allowed for field \"identifier\""}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Processed 1 file changes in 13.875µs"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"======== Cloning snapshot 2 ========\n[18:30:47.225] Reason: RequestedLanguageService (pending file changes) -  Documents: [file:///path/to/zed-oxc-repro/mod.ts]\n[18:30:47.225] DidChangeCustomConfigFileName\n[18:30:47.225] DidChangeFiles\n\t[18:30:47.225] Checking for changes affecting config files\n\t\t[18:30:47.225] Summarizing file changes\n\t\t[18:30:47.225] Checking if any changed files are config files\n\t[18:30:47.225] Marking project /path/to/zed-oxc-repro/tsconfig.json as dirty due to changes in /path/to/zed-oxc-repro/mod.ts\n[18:30:47.225] DidRequestFile\n\t[18:30:47.225] Acquiring config for project\n\t[18:30:47.225] CompilerHost\n\t[18:30:47.226] Program update for /path/to/zed-oxc-repro/tsconfig.json completed in 147.958µs\n[18:30:47.226] UpdateAutoImports\n\t[18:30:47.226] Building autoimport registry\n\t\t[18:30:47.226] Updated buckets and directories in 10.291µs\n\t\t[18:30:47.226] Built autoimport registry in 13.583µs\n[18:30:47.226] Finished cloning snapshot 2 into snapshot 3 in 210.042µs\n"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"\n======== Runtime Metrics ========\n/gc/cleanups/executed:cleanups = 0\n/gc/cleanups/queued:cleanups = 0\n/gc/cycles/automatic:gc-cycles = 5\n/gc/cycles/forced:gc-cycles = 0\n/gc/cycles/total:gc-cycles = 5\n/gc/finalizers/executed:finalizers = 0\n/gc/finalizers/queued:finalizers = 0\n/gc/gogc:percent = 100\n/gc/gomemlimit:bytes = 9223372036854775807\n/gc/heap/allocs:bytes = 8011608\n/gc/heap/allocs:objects = 26580\n/gc/heap/frees:bytes = 895640\n/gc/heap/frees:objects = 6146\n/gc/heap/goal:bytes = 13968410\n/gc/heap/live:bytes = 6745728\n/gc/heap/objects:objects = 20434\n/gc/heap/tiny/allocs:objects = 709\n/gc/limiter/last-enabled:gc-cycle = 0\n/gc/scan/globals:bytes = 425098\n/gc/scan/heap:bytes = 5571144\n/gc/scan/stack:bytes = 51856\n/gc/scan/total:bytes = 6048098\n/gc/stack/starting-size:bytes = 2048\n/memory/classes/heap/free:bytes = 368640\n/memory/classes/heap/objects:bytes = 7115968\n/memory/classes/heap/released:bytes = 8151040\n/memory/classes/heap/stacks:bytes = 1343488\n/memory/classes/heap/unused:bytes = 3992384\n/memory/classes/metadata/mcache/free:bytes = 0\n/memory/classes/metadata/mcache/inuse:bytes = 32144\n/memory/classes/metadata/mspan/free:bytes = 3520\n/memory/classes/metadata/mspan/inuse:bytes = 208640\n/memory/classes/metadata/other:bytes = 3720944\n/memory/classes/os-stacks:bytes = 0\n/memory/classes/other:bytes = 2789331\n/memory/classes/profiling/buckets:bytes = 1456117\n/memory/classes/total:bytes = 29182216"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":""}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Updated watches in 10.667µs"}}

// Receive:
{"jsonrpc":"2.0","id":12,"result":null}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/linkedEditingRange' (12) in 457µs"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"======== Cloning snapshot 3 ========\n[18:30:47.226] DidChangeCustomConfigFileName\n[18:30:47.226] DidRequestFile\n\t[18:30:47.226] Acquiring config for project\n[18:30:47.226] UpdateAutoImports\n\t[18:30:47.226] Building autoimport registry\n\t\t[18:30:47.226] Updated buckets and directories in 50.666µs\n\t\t[18:30:47.232] Building project bucket /path/to/zed-oxc-repro/tsconfig.json\n\t\t\t[18:30:47.233] Extracted exports: 1.264417ms (3 exports, 0 used checker, 3 created checkers)\n\t\t\t[18:30:47.233] Built index: 15.916µs\n\t\t\t[18:30:47.233] Bucket total: 1.281292ms\n\t\t[18:30:47.232] Building node_modules bucket /path/to/zed-oxc-repro\n\t\t\t[18:30:47.232] Installed 44 exports (0 used checker)\n\t\t\t[18:30:47.232] Built index: 84.75µs\n\t\t\t[18:30:47.232] Bucket total: 118.75µs\n\t\t[18:30:47.233] Built 2 indexes in 1.289375ms\n\t\t[18:30:47.233] Built autoimport registry in 7.231875ms\n[18:30:47.233] Finished cloning snapshot 3 into snapshot 4 in 7.305458ms\n"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"\n======== Runtime Metrics ========\n/gc/cleanups/executed:cleanups = 0\n/gc/cleanups/queued:cleanups = 0\n/gc/cycles/automatic:gc-cycles = 6\n/gc/cycles/forced:gc-cycles = 0\n/gc/cycles/total:gc-cycles = 6\n/gc/finalizers/executed:finalizers = 0\n/gc/finalizers/queued:finalizers = 0\n/gc/gogc:percent = 100\n/gc/gomemlimit:bytes = 9223372036854775807\n/gc/heap/allocs:bytes = 11638824\n/gc/heap/allocs:objects = 37717\n/gc/heap/frees:bytes = 1513336\n/gc/heap/frees:objects = 10866\n/gc/heap/goal:bytes = 20633338\n/gc/heap/live:bytes = 10092512\n/gc/heap/objects:objects = 26851\n/gc/heap/tiny/allocs:objects = 1021\n/gc/limiter/last-enabled:gc-cycle = 0\n/gc/scan/globals:bytes = 425098\n/gc/scan/heap:bytes = 8545912\n/gc/scan/stack:bytes = 23216\n/gc/scan/total:bytes = 8994226\n/gc/stack/starting-size:bytes = 2048\n/memory/classes/heap/free:bytes = 516096\n/memory/classes/heap/objects:bytes = 10125488\n/memory/classes/heap/released:bytes = 5324800\n/memory/classes/heap/stacks:bytes = 1343488\n/memory/classes/heap/unused:bytes = 3661648\n/memory/classes/metadata/mcache/free:bytes = 0\n/memory/classes/metadata/mcache/inuse:bytes = 32144\n/memory/classes/metadata/mspan/free:bytes = 5440\n/memory/classes/metadata/mspan/inuse:bytes = 239360\n/memory/classes/metadata/other:bytes = 3855600\n/memory/classes/os-stacks:bytes = 0\n/memory/classes/other:bytes = 2882323\n/memory/classes/profiling/buckets:bytes = 1457973\n/memory/classes/total:bytes = 29444360"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":""}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Updated watches in 4.125µs"}}

// Send:
{"jsonrpc":"2.0","id":14,"method":"textDocument/documentHighlight","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"position":{"line":0,"character":24}}}

// Receive:
{"jsonrpc":"2.0","id":14,"result":[{"range":{"start":{"line":0,"character":18},"end":{"line":0,"character":24}},"kind":2}]}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/documentHighlight' (14) in 496.541µs"}}

// Send:
{"jsonrpc":"2.0","id":15,"method":"textDocument/codeAction","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"range":{"start":{"line":0,"character":24},"end":{"line":0,"character":24}},"context":{"diagnostics":[]}}}

// Receive:
{"jsonrpc":"2.0","id":15,"result":[]}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/codeAction' (15) in 52.333µs"}}

// Send:
{"jsonrpc":"2.0","id":16,"method":"textDocument/codeLens","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"}}}

// Receive:
{"jsonrpc":"2.0","id":16,"result":null}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/codeLens' (16) in 44.459µs"}}

// Send:
{"jsonrpc":"2.0","method":"textDocument/didChange","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts","version":2},"contentChanges":[{"range":{"start":{"line":0,"character":24},"end":{"line":0,"character":24}},"text":";"}]}}

// Send:
{"jsonrpc":"2.0","id":17,"method":"textDocument/onTypeFormatting","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"position":{"line":0,"character":25},"ch":";","options":{"tabSize":4,"insertSpaces":false,"trimTrailingWhitespace":true,"insertFinalNewline":true,"trimFinalNewlines":true}}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/didChange' in 14.459µs"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Processed 1 file changes in 28.75µs"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"======== Cloning snapshot 4 ========\n[18:30:48.725] Reason: RequestedLanguageService (pending file changes) -  Documents: [file:///path/to/zed-oxc-repro/mod.ts]\n[18:30:48.725] DidChangeCustomConfigFileName\n[18:30:48.725] DidChangeFiles\n\t[18:30:48.725] Checking for changes affecting config files\n\t\t[18:30:48.725] Summarizing file changes\n\t\t[18:30:48.725] Checking if any changed files are config files\n\t[18:30:48.725] Marking project /path/to/zed-oxc-repro/tsconfig.json as dirty due to changes in /path/to/zed-oxc-repro/mod.ts\n[18:30:48.725] DidRequestFile\n\t[18:30:48.725] Acquiring config for project\n\t[18:30:48.725] CompilerHost\n\t[18:30:48.726] Program update for /path/to/zed-oxc-repro/tsconfig.json completed in 488.958µs\n[18:30:48.726] UpdateAutoImports\n\t[18:30:48.726] Building autoimport registry\n\t\t[18:30:48.726] Updated buckets and directories in 26.417µs\n\t\t[18:30:48.726] Built autoimport registry in 42.25µs\n[18:30:48.726] Finished cloning snapshot 4 into snapshot 5 in 661.792µs\n"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"\n======== Runtime Metrics ========\n/gc/cleanups/executed:cleanups = 0\n/gc/cleanups/queued:cleanups = 0\n/gc/cycles/automatic:gc-cycles = 6\n/gc/cycles/forced:gc-cycles = 0\n/gc/cycles/total:gc-cycles = 6\n/gc/finalizers/executed:finalizers = 0\n/gc/finalizers/queued:finalizers = 0\n/gc/gogc:percent = 100\n/gc/gomemlimit:bytes = 9223372036854775807\n/gc/heap/allocs:bytes = 11836392\n/gc/heap/allocs:objects = 39168\n/gc/heap/frees:bytes = 1513336\n/gc/heap/frees:objects = 10866\n/gc/heap/goal:bytes = 20633338\n/gc/heap/live:bytes = 10092512\n/gc/heap/objects:objects = 28302\n/gc/heap/tiny/allocs:objects = 1021\n/gc/limiter/last-enabled:gc-cycle = 0\n/gc/scan/globals:bytes = 425098\n/gc/scan/heap:bytes = 8809600\n/gc/scan/stack:bytes = 23216\n/gc/scan/total:bytes = 9257914\n/gc/stack/starting-size:bytes = 2048\n/memory/classes/heap/free:bytes = 516096\n/memory/classes/heap/objects:bytes = 10323056\n/memory/classes/heap/released:bytes = 5218304\n/memory/classes/heap/stacks:bytes = 1343488\n/memory/classes/heap/unused:bytes = 3570576\n/memory/classes/metadata/mcache/free:bytes = 0\n/memory/classes/metadata/mcache/inuse:bytes = 32144\n/memory/classes/metadata/mspan/free:bytes = 5440\n/memory/classes/metadata/mspan/inuse:bytes = 239360\n/memory/classes/metadata/other:bytes = 3871472\n/memory/classes/os-stacks:bytes = 0\n/memory/classes/other:bytes = 2866451\n/memory/classes/profiling/buckets:bytes = 1457973\n/memory/classes/total:bytes = 29444360"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":""}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Updated watches in 20.375µs"}}

// Receive:
{"jsonrpc":"2.0","id":17,"result":[]}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/onTypeFormatting' (17) in 7.870041ms"}}

// Send:
{"jsonrpc":"2.0","id":18,"method":"textDocument/linkedEditingRange","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"position":{"line":0,"character":25}}}

// Receive:
{"jsonrpc":"2.0","id":18,"result":null}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/linkedEditingRange' (18) in 40.25µs"}}

// Send:
{"jsonrpc":"2.0","id":19,"method":"textDocument/diagnostic","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"identifier":null,"previousResultId":null}}

// Receive:
{"jsonrpc":"2.0","id":19,"error":{"code":-32602,"message":"InvalidParams: json: cannot unmarshal JSON object into Go lsproto.Message: InvalidParams: failed to unmarshal *lsproto.DocumentDiagnosticParams: json: cannot unmarshal into Go lsproto.DocumentDiagnosticParams within \"/identifier\": null value is not allowed for field \"identifier\""}}

// Send:
{"jsonrpc":"2.0","id":20,"method":"textDocument/documentHighlight","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"position":{"line":0,"character":25}}}

// Receive:
{"jsonrpc":"2.0","id":20,"result":[]}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/documentHighlight' (20) in 389.125µs"}}

// Send:
{"jsonrpc":"2.0","id":21,"method":"textDocument/codeAction","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"},"range":{"start":{"line":0,"character":25},"end":{"line":0,"character":25}},"context":{"diagnostics":[]}}}

// Receive:
{"jsonrpc":"2.0","id":21,"result":[]}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/codeAction' (21) in 68.584µs"}}

// Send:
{"jsonrpc":"2.0","id":22,"method":"textDocument/codeLens","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"}}}

// Receive:
{"jsonrpc":"2.0","id":22,"result":null}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/codeLens' (22) in 45.708µs"}}

// Send:
{"jsonrpc":"2.0","method":"workspace/didChangeWatchedFiles","params":{"changes":[{"uri":"file:///path/to/zed-oxc-repro/mod.ts","type":2}]}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Scheduling new diagnostics refresh..."}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'workspace/didChangeWatchedFiles' in 23.875µs"}}

// Send:
{"jsonrpc":"2.0","method":"textDocument/didSave","params":{"textDocument":{"uri":"file:///path/to/zed-oxc-repro/mod.ts"}}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":4,"message":"Canceled scheduled diagnostics refresh"}}

// Receive:
{"jsonrpc":"2.0","method":"window/logMessage","params":{"type":3,"message":"handled method 'textDocument/didSave' in 9.875µs"}}
```
