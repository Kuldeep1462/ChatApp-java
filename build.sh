#!/bin/bash
set -e

# Set Java version
export JAVA_VERSION=17

# Build the application
mvn clean package -DskipTests 