#!/bin/sh

FILE_PATH="$1"
shift
BIN_PATH="$1"

BIN_EXE="${BIN_PATH}.exe"

# Check if the file syntax is valid
mcs -o+ -out:"$BIN_EXE" "$FILE_PATH"
EXIT_CODE=$?
[ "$EXIT_CODE" -ne 0 ] && exit $EXIT_CODE

# Check for output file:
if [ ! -f "$BIN_EXE" ]; then
	echo "Error: byte-compiled file '$BIN_EXE' not found."
	exit 1
fi

cat >"$BIN_PATH" <<EOF
#!/bin/sh
# Generated shell-script to execute javascript interpreter on source.

exec mono "$BIN_EXE" "\$@"
EOF

chmod a+x "$BIN_PATH"

exit 0
