#!/bin/bash
for x in `cat .envrc.local`; do echo $x && export $x; done;
