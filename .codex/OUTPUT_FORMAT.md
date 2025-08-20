# Output Format

Option A: Unified Diff (preferred)
```diff
--- a/path/to/file.ext
+++ b/path/to/file.ext
@@
- old line
+ new line
```

Option B: File Blocks (if diffs are impractical)
```
<entire new file content>
```

Epilogue

- Files changed:
  - path/to/file.ext
- Tests added/updated:
  - path/to/test.ext
- Notes:
  - Any decisions or follow-ups.
