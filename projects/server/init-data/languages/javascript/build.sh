#!/bin/sh

FILE_PATH="$1"
shift
BIN_PATH="$1"

# Check if the file syntax is valid
node -c "$FILE_PATH" >/dev/null
EXIT_CODE=$?
[ "$EXIT_CODE" -ne 0 ] && exit $EXIT_CODE

cat >"$BIN_PATH" <<EOF
#!/bin/sh
# Generated shell-script to execute javascript interpreter on source.

exec node '$FILE_PATH' "\$@"
EOF

chmod a+x "$BIN_PATH"

exit 0
