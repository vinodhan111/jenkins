$(awk -v module="${module}" -F: '/"'${module}'"/ {gsub(/"|,| /, "", $2); print $2}' images.json)
