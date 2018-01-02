#!/bin/bash
running=1
echo "Launching..."
while (( running )); do
    node ./
    echo "Restarting..."
done