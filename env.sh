#!/bin/bash
for x in `cat .envrc.example`; do echo $x && export $x; done;
