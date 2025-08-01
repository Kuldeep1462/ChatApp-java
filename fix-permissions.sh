#!/bin/bash
set -e

# Make Maven wrapper executable
chmod +x mvnw
chmod +x mvnw.cmd

# Make build script executable
chmod +x build.sh

echo "Permissions fixed successfully!" 