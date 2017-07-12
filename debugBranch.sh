#!/bin/bash

git co -f
git co master
git branch -D debug
git push origin --delete debug
git branch debug 3491bdccbe3d7353a46ff0e52fb87936c47c9994
git co debug
