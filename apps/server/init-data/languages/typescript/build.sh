#!/bin/sh

FILE_PATH="$1"
shift
BIN_PATH="$1"

# Check if the file syntax is valid
tsc "$FILE_PATH" --types "/usr/local/lib/node_modules/@types/node" >/dev/null
EXIT_CODE=$?
[ "$EXIT_CODE" -ne 0 ] && exit $EXIT_CODE

MAIN_FILE=$(basename "$FILE_PATH" .ts)

cat >"$BIN_PATH" <<EOF
#!/bin/sh
# Generated shell-script to execute javascript interpreter on source.

exec node "$MAIN_FILE.js" "\$@"
EOF

chmod a+x "$BIN_PATH"

exit 0
